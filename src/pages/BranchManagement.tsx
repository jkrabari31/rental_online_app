import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { Building2, Plus, Edit, Trash2, MapPin, Phone, Car, Users } from 'lucide-react';

export function BranchManagement() {
  const [branches, setBranches] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await api.get<any[]>('/branches');
      setBranches(data || []);
    } catch (err: any) {
      console.error('Failed to load branches:', err);
    }
  };

  const handleOpenDialog = (branch?: any) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        location: branch.location || '',
        contactNumber: branch.contactNumber || '',
      });
    } else {
      setEditingBranch(null);
      setFormData({ name: '', location: '', contactNumber: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await api.put(`/branches/${editingBranch.id}`, formData);
      } else {
        await api.post('/branches', formData);
      }
      setIsDialogOpen(false);
      loadBranches();
    } catch (err: any) {
      alert('Failed to save branch: ' + err.message);
    }
  };

  const handleDeactivate = async (branchId: string) => {
    if (!confirm('Are you sure you want to deactivate this branch? Branch users will not be able to operate until reactivated.')) return;
    try {
      await api.delete(`/branches/${branchId}`);
      loadBranches();
    } catch (err: any) {
      alert('Failed to deactivate branch: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage rental branch locations</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Branch
        </Button>
      </div>

      <div className="border rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead>Branch Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Vehicles</TableHead>
              <TableHead className="text-center">Users</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <TableCell className="font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                  {branch.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {branch.location ? (
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {branch.location}</span>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {branch.contactNumber ? (
                    <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {branch.contactNumber}</span>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-center font-medium">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Car className="w-3 h-3 mr-1" /> {branch._count?.vehicles || 0}
                  </span>
                </TableCell>
                <TableCell className="text-center font-medium">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Users className="w-3 h-3 mr-1" /> {branch._count?.users || 0}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${branch.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}`}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(branch)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {branch.isActive && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeactivate(branch.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {branches.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No branches found. Click "Add Branch" to create your first branch location.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Branch Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Branch Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Downtown Branch"
              />
            </div>
            <div className="space-y-2">
              <Label>Location / Address</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Main Street, Sector 5"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="e.g. +91 9876543210"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Branch</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
