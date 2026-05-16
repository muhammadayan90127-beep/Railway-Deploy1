import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useAdminLogin, 
  useAdminVerify,
  getAdminVerifyQueryKey,
  useListBookings, 
  useUpdateBookingStatus,
  getListBookingsQueryKey,
  useListReviews,
  useUpdateReviewStatus,
  useToggleReviewPin,
  useDeleteReview,
  getListReviewsQueryKey,
  useListContacts,
  useMarkContactReplied,
  useDeleteContact,
  getListContactsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Loader2, LogOut, Pin, PinOff, Trash2, CheckCircle, XCircle, Search, MessageSquare, Users } from 'lucide-react';

const BASE_PATH = (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');

export const AdminPanel: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("mh_admin_token"));
  const { toast } = useToast();

  const { data: verifyData, isLoading: isVerifying } = useAdminVerify({
    query: { enabled: !!token, retry: false, queryKey: getAdminVerifyQueryKey() }
  });

  useEffect(() => {
    if (token && verifyData && !verifyData.ok) { handleLogout(); }
  }, [verifyData, token]);

  const handleLogout = () => { localStorage.removeItem("mh_admin_token"); setToken(null); };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!token || (verifyData && !verifyData.ok)) return <LoginScreen setToken={setToken} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-lg rounded-sm">MH</div>
            <h1 className="font-serif text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-foreground/70 hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card border border-border/50 p-1">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bookings</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Reviews</TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Messages</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="bookings" asChild>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><BookingsTab /></motion.div>
            </TabsContent>
            <TabsContent value="reviews" asChild>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><ReviewsTab /></motion.div>
            </TabsContent>
            <TabsContent value="contacts" asChild>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><ContactsTab /></motion.div>
            </TabsContent>
            <TabsContent value="users" asChild>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><UsersTab adminToken={token} /></motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
};

const LoginScreen = ({ setToken }: { setToken: (t: string) => void }) => {
  const [password, setPassword] = useState('');
  const login = useAdminLogin();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    login.mutate({ data: { password } }, {
      onSuccess: (data) => {
        localStorage.setItem("mh_admin_token", data.token);
        setToken(data.token);
        toast({ title: "Login successful" });
      },
      onError: (err: any) => toast({ title: "Login failed", description: err.message || "Invalid password", variant: "destructive" })
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl z-10">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-3xl rounded-sm mx-auto mb-6 shadow-lg shadow-primary/20">MH</div>
          <CardTitle className="font-serif text-2xl text-foreground">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background/50 border-border/50 text-center text-lg py-6" data-testid="admin-password-input" />
            <Button type="submit" className="w-full py-6 text-lg font-medium" disabled={login.isPending || !password} data-testid="admin-login-button">
              {login.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const BookingsTab = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: bookings, isLoading } = useListBookings(
    { status: statusFilter !== 'all' ? statusFilter as any : undefined, search: search || undefined },
    { query: { queryKey: getListBookingsQueryKey() } }
  );

  const updateStatus = useUpdateBookingStatus();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate({ id, data: { status: status as any } }, {
      onSuccess: () => { toast({ title: "Status updated" }); queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() }); },
      onError: () => toast({ title: "Failed to update status", variant: "destructive" })
    });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", confirmed: "bg-green-500/10 text-green-500 border-green-500/20", completed: "bg-blue-500/10 text-blue-500 border-blue-500/20", rejected: "bg-red-500/10 text-red-500 border-red-500/20" };
    return <Badge variant="outline" className={map[status] ?? ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name, email, or service..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48 bg-card"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            {['all', 'pending', 'confirmed', 'completed', 'rejected'].map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Client</TableHead><TableHead>Contact</TableHead><TableHead>Service</TableHead><TableHead>Date & Time</TableHead><TableHead>Budget</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : !bookings?.length ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No bookings found.</TableCell></TableRow>
              ) : bookings.map((b) => (
                <TableRow key={b.id} className="border-border/50">
                  <TableCell>
                    <div className="font-medium text-foreground">{(b as any).fullName}</div>
                    <div className="text-xs text-muted-foreground">{(b as any).projectLocation}</div>
                    <div className="text-xs text-primary/70">{(b as any).consultationId}</div>
                  </TableCell>
                  <TableCell><div className="text-sm">{(b as any).email}</div><div className="text-sm">{(b as any).phone}</div></TableCell>
                  <TableCell>{b.service}</TableCell>
                  <TableCell><div className="text-sm">{(b as any).preferredDate}</div><div className="text-sm text-muted-foreground">{(b as any).timeSlot}</div></TableCell>
                  <TableCell>{(b as any).budgetRange}</TableCell>
                  <TableCell>{getStatusBadge(b.status ?? 'pending')}</TableCell>
                  <TableCell>
                    <Select defaultValue={b.status ?? 'pending'} onValueChange={(val) => handleStatusChange(b.id!, val)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['pending', 'confirmed', 'completed', 'rejected'].map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

const ReviewsTab = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reviews, isLoading } = useListReviews(
    { status: statusFilter !== 'all' ? statusFilter as any : undefined },
    { query: { queryKey: getListReviewsQueryKey() } }
  );

  const updateStatus = useUpdateReviewStatus();
  const togglePin = useToggleReviewPin();
  const deleteReview = useDeleteReview();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
    queryClient.invalidateQueries({ queryKey: ['/api/reviews/approved'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <Button key={s} variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)} className="capitalize">{s}</Button>
        ))}
      </div>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        : !reviews?.length ? <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-lg border border-border/50">No reviews found.</div>
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(r => (
              <Card key={r.id} className="bg-card/50 backdrop-blur-sm border-border/50 relative group">
                {r.isPinned && <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg"><Pin className="w-4 h-4" /></div>}
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-serif font-bold text-lg">{(r as any).name}</h4>
                      {(r as any).city && <p className="text-xs text-muted-foreground uppercase tracking-wider">{(r as any).city}</p>}
                    </div>
                    <Badge variant={r.status === 'approved' ? 'default' : r.status === 'rejected' ? 'destructive' : 'secondary'}>{r.status}</Badge>
                  </div>
                  <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <span key={i} className={i < r.rating! ? "text-primary" : "text-muted-foreground"}>★</span>)}</div>
                  <p className="text-sm text-foreground/80 italic mb-6 line-clamp-3">"{(r as any).message}"</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                    {r.status !== 'approved' && (
                      <Button size="sm" variant="outline" className="flex-1 text-green-500 hover:bg-green-500/10" onClick={() => updateStatus.mutate({ id: r.id!, data: { status: 'approved' as any } }, { onSuccess: () => { toast({ title: "Review approved" }); invalidate(); } })}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    )}
                    {r.status !== 'rejected' && (
                      <Button size="sm" variant="outline" className="flex-1 text-red-500 hover:bg-red-500/10" onClick={() => updateStatus.mutate({ id: r.id!, data: { status: 'rejected' as any } }, { onSuccess: () => { toast({ title: "Review rejected" }); invalidate(); } })}>
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    )}
                    {r.status === 'approved' && (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => togglePin.mutate({ id: r.id!, data: { isPinned: !r.isPinned } }, { onSuccess: () => { toast({ title: r.isPinned ? "Unpinned" : "Pinned" }); invalidate(); } })}>
                        {r.isPinned ? <><PinOff className="w-4 h-4 mr-1" /> Unpin</> : <><Pin className="w-4 h-4 mr-1" /> Pin</>}
                      </Button>
                    )}
                    <Button size="icon" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete this review?")) deleteReview.mutate({ id: r.id! }, { onSuccess: () => { toast({ title: "Deleted" }); invalidate(); } }); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
};

const ContactsTab = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'replied' | 'unreplied'>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: contacts, isLoading } = useListContacts(
    { search: search || undefined, replied: filter === 'all' ? undefined : filter === 'replied' },
    { query: { queryKey: getListContactsQueryKey() } }
  );

  const markReplied = useMarkContactReplied();
  const deleteContact = useDeleteContact();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <div className="flex gap-2">
          {(['all', 'unreplied', 'replied'] as const).map(f => <Button key={f} variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)} className="capitalize">{f}</Button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : !contacts?.length ? <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-lg border border-border/50">No messages found.</div>
          : contacts.map(c => (
            <Card key={c.id} className={`bg-card/50 backdrop-blur-sm border-border/50 transition-colors ${!c.isReplied ? 'border-primary/30 shadow-[0_0_15px_rgba(201,169,110,0.1)]' : ''}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg">{c.name}</h4>
                      {!c.isReplied && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                    <p className="text-sm text-muted-foreground">{c.phone}</p>
                    <div className="text-xs text-primary bg-primary/10 inline-block px-2 py-1 rounded mt-2">{c.service}</div>
                    <div className="text-xs text-muted-foreground mt-2">{format(new Date(c.createdAt!), 'PPpp')}</div>
                  </div>
                  <div className="md:w-2/3 flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <MessageSquare className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">{c.message}</p>
                    </div>
                    <div className="flex gap-3 mt-auto justify-end border-t border-border/50 pt-4">
                      {!c.isReplied && (
                        <Button size="sm" onClick={() => markReplied.mutate({ id: c.id! }, { onSuccess: () => { toast({ title: "Marked as replied" }); queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() }); } })} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <CheckCircle className="w-4 h-4 mr-2" /> Mark Replied
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete this message?")) deleteContact.mutate({ id: c.id! }, { onSuccess: () => { toast({ title: "Deleted" }); queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() }); } }); }}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

const UsersTab = ({ adminToken }: { adminToken: string }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${BASE_PATH}/api/admin/users`, { headers: { Authorization: `Bearer ${adminToken}` } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setUsers(data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [adminToken]);

  const handleLockToggle = async (id: number, isLocked: boolean) => {
    try {
      const res = await fetch(`${BASE_PATH}/api/admin/users/${id}/lock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ isLocked: !isLocked }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, isLocked: !isLocked } : u));
        toast({ title: `User ${!isLocked ? 'locked' : 'unlocked'} successfully` });
      }
    } catch { toast({ title: "Failed to update user", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Registered</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : !users.length ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No users registered yet.</TableCell></TableRow>
              ) : users.map(u => (
                <TableRow key={u.id} className="border-border/50">
                  <TableCell><div className="font-medium text-foreground">{u.name}</div></TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone ?? '—'}</TableCell>
                  <TableCell>{format(new Date(u.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={u.isLocked ? "destructive" : "default"} className={u.isLocked ? "" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                      {u.isLocked ? "Locked" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleLockToggle(u.id, u.isLocked)} className={u.isLocked ? "text-green-500 hover:bg-green-500/10" : "text-red-500 hover:bg-red-500/10"}>
                      {u.isLocked ? "Unlock" : "Lock"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
