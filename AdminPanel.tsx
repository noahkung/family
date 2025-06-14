// client/src/pages/AdminPanel.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Calendar,
  Download,
  Trash2,
  Eye,
  BarChart3,
  LogOut,
  Shield,
  UserPlus
} from 'lucide-react';
import { RadarChart } from '@/components/RadarChart';
import type { AssessmentResults } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { AssessmentResponse } from '@shared/schema';

// กำหนดคะแนนสูงสุดสำหรับแต่ละมิติและคะแนนรวม
const MAX_DIMENSION_SCORE = 12; // 3 คำถาม * 4 คะแนน/คำถาม
const MAX_OVERALL_SCORE = 48; // 4 มิติ * 12 คะแนน/มิติ

interface AdminStats {
  totalResponses: number;
  monthlyResponses: number;
  averageScore: number;
  completionRate: number;
  roleDistribution: Record<string, number>;
  languageDistribution: Record<string, number>;
  averageScores: {
    governance: number;
    legacy: number;
    relationships: number;
    strategy: number;
    overall: number;
  };
}

export function AdminPanel() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ username: '', password: '' });

  // Authentication mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/admin/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        toast({
          title: t('common.success'),
          description: t('admin.loginSuccess'),
        });
      } else {
        toast({
          title: t('common.error'),
          description: data.message || t('admin.invalidCredentials'),
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.loginError'),
        variant: 'destructive',
      });
    },
  });

  // Fetch statistics
  const { data: stats, isLoading: statsLoading } = useQuery<{ success: boolean; data: AdminStats }>({
    queryKey: ['/api/assessment/stats'],
    enabled: isAuthenticated,
  });

  // Fetch responses
  const { data: responses, isLoading: responsesLoading } = useQuery<{ success: boolean; data: AssessmentResponse[] }>({
    queryKey: ['/api/assessment/responses'],
    enabled: isAuthenticated,
  });

  // Delete response mutation
  const deleteResponseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/assessment/responses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessment/responses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/assessment/stats'] });
      toast({
        title: t('common.success'),
        description: t('admin.responseDeleted'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.deleteFailed'),
        variant: 'destructive',
      });
    },
  });

  // Reset database mutation
  const resetDatabaseMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/assessment/responses`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessment/responses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/assessment/stats'] });
      setShowResetDialog(false);
      toast({
        title: t('common.success'),
        description: t('admin.databaseReset'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.resetFailed'),
        variant: 'destructive',
      });
    },
  });

  // Mutation ใหม่สำหรับเพิ่มผู้ดูแลระบบ
  const addAdminMutation = useMutation({
    mutationFn: async (newAdmin: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/admin/register', newAdmin);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: t('common.success'),
          description: t('admin.addAdminSuccess'),
        });
        setShowAddAdminDialog(false);
        setNewAdminForm({ username: '', password: '' });
      } else {
        toast({
          title: t('common.error'),
          description: data.message || t('admin.addAdminFailed'),
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.addAdminError'),
        variant: 'destructive',
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
  };

  const handleExportCSV = () => {
    window.open('/api/assessment/export', '_blank');
  };

const getScoreLevel = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (maxScore === MAX_OVERALL_SCORE) {
    if (percentage >= 81) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 65) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 50) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    if (percentage >= 31) return { label: 'Needs Improvement', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Critical', color: 'bg-red-100 text-red-800' };
  } else {
    if (percentage >= 83) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 67) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 50) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    if (percentage >= 33) return { label: 'Needs Improvement', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Critical', color: 'bg-red-100 text-red-800' };
  }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-navy">
                {t('admin.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">{t('admin.username')}</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t('admin.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? t('common.loading') : t('admin.login')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            className="text-3xl font-bold text-navy gradient-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('admin.title')}
          </motion.h2>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('admin.logout')}</span>
          </Button>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('admin.totalResponses')}</p>
                    <p className="text-3xl font-bold text-primary">
                      {stats?.data?.totalResponses || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('admin.thisMonth')}</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats?.data?.monthlyResponses || 0}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('admin.avgScore')}</p>
                    <p className="text-3xl font-bold text-accent">
                      {stats?.data?.averageScore.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('admin.completionRate')}</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.data?.completionRate.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Average Assessment Results */}
        {stats?.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-navy text-center">
                    {t('admin.averageAssessmentResults')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <RadarChart
                      results={{
                        governance: {
                          score: Math.round((stats.data.averageScores.governance / 100) * MAX_DIMENSION_SCORE),
                          maxScore: MAX_DIMENSION_SCORE,
                          percentage: stats.data.averageScores.governance,
                          level: getScoreLevel(stats.data.averageScores.governance, 100).label
                        },
                        legacy: {
                          score: Math.round((stats.data.averageScores.legacy / 100) * MAX_DIMENSION_SCORE),
                          maxScore: MAX_DIMENSION_SCORE,
                          percentage: stats.data.averageScores.legacy,
                          level: getScoreLevel(stats.data.averageScores.legacy, 100).label
                        },
                        relationships: {
                          score: Math.round((stats.data.averageScores.relationships / 100) * MAX_DIMENSION_SCORE),
                          maxScore: MAX_DIMENSION_SCORE,
                          percentage: stats.data.averageScores.relationships,
                          level: getScoreLevel(stats.data.averageScores.relationships, 100).label
                        },
                        strategy: {
                          score: Math.round((stats.data.averageScores.strategy / 100) * MAX_DIMENSION_SCORE),
                          maxScore: MAX_DIMENSION_SCORE,
                          percentage: stats.data.averageScores.strategy,
                          level: getScoreLevel(stats.data.averageScores.strategy, 100).label
                        },
                        overall: {
                          score: Math.round((stats.data.averageScores.overall / 100) * MAX_OVERALL_SCORE),
                          maxScore: MAX_OVERALL_SCORE,
                          percentage: stats.data.averageScores.overall,
                          level: getScoreLevel(stats.data.averageScores.overall, 100).label
                        }
                      }}
                      className="w-full h-80"
                      // ต้องส่ง dimensionsData prop ไปให้ RadarChart ด้วย
                      dimensionsData={[
                        { key: 'governance', name: t('dimension.governance'), result: { score: Math.round((stats.data.averageScores?.governance || 0) / 100) * MAX_DIMENSION_SCORE, maxScore: MAX_DIMENSION_SCORE, percentage: stats.data.averageScores?.governance || 0, level: getScoreLevel(stats.data.averageScores?.governance || 0, 100).label } },
                        { key: 'legacy', name: t('dimension.legacy'), result: { score: Math.round((stats.data.averageScores?.legacy || 0) / 100) * MAX_DIMENSION_SCORE, maxScore: MAX_DIMENSION_SCORE, percentage: stats.data.averageScores?.legacy || 0, level: getScoreLevel(stats.data.averageScores?.legacy || 0, 100).label } },
                        { key: 'relationships', name: t('dimension.relationships'), result: { score: Math.round((stats.data.averageScores?.relationships || 0) / 100) * MAX_DIMENSION_SCORE, maxScore: MAX_DIMENSION_SCORE, percentage: stats.data.averageScores?.relationships || 0, level: getScoreLevel(stats.data.averageScores?.relationships || 0, 100).label } },
                        { key: 'strategy', name: t('Strategy'), result: { score: Math.round((stats.data.averageScores?.strategy || 0) / 100) * MAX_DIMENSION_SCORE, maxScore: MAX_DIMENSION_SCORE, percentage: stats.data.averageScores?.strategy || 0, level: getScoreLevel(stats.data.averageScores?.strategy || 0, 100).label } },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Percentage Breakdown */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-navy text-center">
                    {t('admin.averageScoresByDimension')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-navy">{t('admin.governance')}</span>
                      <span className="text-lg font-bold text-blue-600">
                        {stats.data.averageScores.governance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.data.averageScores.governance}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-navy">{t('admin.legacy')}</span>
                      <span className="text-lg font-bold text-green-600">
                        {stats.data.averageScores.legacy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.data.averageScores.legacy}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-navy">{t('admin.relationships')}</span>
                      <span className="text-lg font-bold text-purple-600">
                        {stats.data.averageScores.relationships.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.data.averageScores.relationships}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-navy">{t('admin.strategy')}</span>
                      <span className="text-lg font-bold text-orange-600">
                        {stats.data.averageScores.strategy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.data.averageScores.strategy}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-navy">{t('admin.overallAverage')}</span>
                      <span className="text-xl font-bold text-primary">
                        {stats.data.averageScores.overall.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex space-x-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={handleExportCSV}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('admin.exportCSV')}
          </Button>
          <Button
            onClick={() => setShowResetDialog(true)}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('admin.resetDatabase')}
          </Button>
          {/* ปุ่มใหม่สำหรับเพิ่มผู้ดูแลระบบ */}
          {/* คุณสามารถเปิดใช้งาน Dialog นี้ได้หากต้องการเพิ่ม admin ผ่าน UI */}
          {/* <Button
            onClick={() => setShowAddAdminDialog(true)}
            variant="secondary"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {t('admin.addAdmin')}
          </Button> */}
        </motion.div>

        {/* Responses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-navy">
                {t('admin.recentResponses')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {responsesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="shadow-lg">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : responses?.data && responses.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('table.date')}</TableHead>
                        <TableHead>{t('table.time')}</TableHead>
                        <TableHead>{t('table.role')}</TableHead>
                        <TableHead>{t('table.userName')}</TableHead> {/* เพิ่ม TableHead สำหรับ User Name */}
                        <TableHead>{t('table.overallScore')}</TableHead>
                        <TableHead>{t('table.governance')}</TableHead>
                        <TableHead>{t('table.legacy')}</TableHead>
                        <TableHead>{t('table.relationships')}</TableHead>
                        <TableHead>{t('table.strategy')}</TableHead>
                        <TableHead>{t('table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.data.map((response) => {
                        const overallLevel = getScoreLevel(response.overallScore, MAX_OVERALL_SCORE);
                        const overallPercentage = Math.round((response.overallScore / MAX_OVERALL_SCORE) * 100);

                        return (
                          <TableRow key={response.id} className="hover:bg-gray-50">
                            <TableCell>{formatDate(response.createdAt)}</TableCell>
                            <TableCell>{new Date(response.createdAt).toLocaleTimeString()}</TableCell>
                            <TableCell className="capitalize">{response.role.replace('-', ' ')}</TableCell>
                            <TableCell>{response.userName || t('common.anonymous')}</TableCell> {/* แสดง userName หรือ Anonymous */}
                            <TableCell>
                              <Badge className={overallLevel.color}>
                                {overallPercentage}%
                              </Badge>
                            </TableCell>
                            <TableCell>{Math.round((response.governanceScore / MAX_DIMENSION_SCORE) * 100)}%</TableCell>
                            <TableCell>{Math.round((response.legacyScore / MAX_DIMENSION_SCORE) * 100)}%</TableCell>
                            <TableCell>{Math.round((response.relationshipsScore / MAX_DIMENSION_SCORE) * 100)}%</TableCell>
                            <TableCell>{Math.round(((response as any).strategyScore / MAX_DIMENSION_SCORE) * 100)}%</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    toast({
                                      title: t('table.viewDetails'),
                                      description: t('table.viewDetailsDescription'),
                                    });
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteResponseMutation.mutate(response.id)}
                                  disabled={deleteResponseMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('admin.noResponsesYet')}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Reset Database Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.confirmResetTitle')}</DialogTitle>
              <DialogDescription>
                {t('admin.confirmResetDescription')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => resetDatabaseMutation.mutate()}
                disabled={resetDatabaseMutation.isPending}
              >
                {resetDatabaseMutation.isPending ? t('common.loading') : t('admin.resetConfirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Add Admin Dialog */}
        <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.addAdminTitle')}</DialogTitle>
              <DialogDescription>
                {t('admin.addAdminDescription')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); addAdminMutation.mutate(newAdminForm); }} className="space-y-4 py-4">
              <div>
                <Label htmlFor="new-admin-username">{t('admin.username')}</Label>
                <Input
                  id="new-admin-username"
                  type="text"
                  value={newAdminForm.username}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-admin-password">{t('admin.password')}</Label>
                <Input
                  id="new-admin-password"
                  type="password"
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddAdminDialog(false)}
                  disabled={addAdminMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={addAdminMutation.isPending}
                >
                  {t('admin.addAdminSave')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}