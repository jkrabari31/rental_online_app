import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { Users, UserPlus, Edit, Trash2, ShieldCheck, Building2, KeyRound } from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
    role: 'BRANCH',
    branchId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [u, b] = await Promise.all([
        api.get<any[]>('/users'),
        api.get<any[]>('/branches'),
      ]);
      setUsers(u || []);
      setBranches(b || []);
    } catch (err: any) {
      console.error('Failed to load user management data:', err);
    }
  };

  const handleOpenDialog = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: '',
        displayName: user.displayName,
        role: user.role,
        branchId: user.branchId || '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        displayName: '',
        role: 'BRANCH',
        branchId: branches[0]?.id || '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.role === 'BRANCH' && !formData.branchId) {
      alert('Branch users must be assigned to a branch.');
      return;
    }

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setIsDialogOpen(false);
      loadData();
    } catch (err: any) {
      alert('Failed to save user credentials: ' + err.message);
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (!confirm('Are you sure you want to deactivate this user? They will no longer be able to log in.')) return;
    try {
      await api.delete(`/users/${userId}`);
      loadData();
    } catch (err: any) {
      alert('Failed to deactivate user: ' + err.message);
    }
  };

  const selectedBranchName = branches.find(b => b.id === formData.branchId)?.name || 'Select branch';
  const selectedRoleName = formData.role === 'ADMIN' ? 'Super Admin' : 'Branch Operator';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Credentials & Access</h1>
          <p className="text-muted-foreground mt-1">Manage user logins and assign branch operator roles</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shadow-sm">
          <UserPlus className="w-4 h-4 mr-2" /> Add User Credentials
        </Button>
      </div>

      <div className="border rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead>Username</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead>Assigned Branch</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-100 flex items-center">
                  <KeyRound className="w-4 h-4 mr-2 text-slate-400" />
                  {u.username}
                </TableCell>
                <TableCell className="font-medium">{u.displayName}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'}`}>
                    {u.role === 'ADMIN' ? '⚡ ADMIN' : '🏢 BRANCH'}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  {u.role === 'ADMIN' ? (
                    <span className="text-muted-foreground italic flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-500" /> All Branches (Global)</span>
                  ) : u.branch ? (
                    <span className="flex items-center font-medium"><Building2 className="w-3.5 h-3.5 mr-1 text-blue-500" /> {u.branch.name}</span>
                  ) : (
                    <span className="text-red-500 text-xs">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(u)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {u.isActive && u.role !== 'ADMIN' && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeactivate(u.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit Credentials' : 'Create User Credentials'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled={!!editingUser}
                placeholder="e.g. branch1_admin"
              />
            </div>

            <div className="space-y-2">
              <Label>Full / Display Name</Label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                placeholder={editingUser ? '••••••••' : 'Enter password'}
              />
            </div>

            <div className="space-y-2">
              <Label>User Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val: string | null) => setFormData({ ...formData, role: val || 'BRANCH' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role">
                    {selectedRoleName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRANCH">Branch Operator</SelectItem>
                  <SelectItem value="ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'BRANCH' && (
              <div className="space-y-2">
                <Label>Assigned Branch Location</Label>
                <Select 
                  value={formData.branchId} 
                  onValueChange={(val: string | null) => setFormData({ ...formData, branchId: val || '' })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch">
                      {selectedBranchName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Credentials</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
