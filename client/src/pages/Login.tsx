import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuthLogin, mockAuthRegister } from '../api/mockServer';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [role, setRole] = useState<'STUDENT' | 'STAFF'>('STUDENT');
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await mockAuthLogin(role);
      login(result.user, result.token);
      toast({ title: '로그인 성공', description: `${result.user.name}님 환영합니다.` });
      navigate('/');
    } catch (error) {
      toast({ title: '로그인 실패', description: '다시 시도해주세요.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      toast({ title: '이름을 입력해주세요.', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      const result = await mockAuthRegister({ name: name.trim(), role });
      login(result.user, result.token);
      toast({ title: '회원가입 완료', description: `${result.user.name}님 환영합니다.` });
      navigate('/');
    } catch (error) {
      toast({ title: '회원가입 실패', description: '다시 시도해주세요.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute -top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[55%] w-[60%] bg-gradient-to-br from-emerald-50 via-white to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.08),transparent_35%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center gap-10 px-6 py-12">
        <section className="hidden flex-1 flex-col justify-center space-y-6 lg:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            캠퍼스 스마트 주차
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            ParkEase로 여석을 확인하고
            <br />
            가장 가까운 자리로 안내받으세요.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">
            실시간 센서 데이터를 기반으로 주차장 혼잡도를 예측하고,
            예약 가능한 구역을 안내합니다. 학교 구성원을 위한
            간단하고 빠른 예약 흐름을 제공합니다.
          </p>
          <div className="grid max-w-lg grid-cols-3 gap-3">
            {[
              { label: '실시간 여석', value: '24개' },
              { label: '예상 대기', value: '2분' },
              { label: '활성 구역', value: '6개' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-emerald-100 bg-white/80 p-3 shadow-sm">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-emerald-700">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full max-w-md">
          <div className="rounded-[28px] border border-emerald-100/70 bg-white/85 p-6 shadow-2xl backdrop-blur">
            <div className="mb-6 space-y-2">
              <p className="text-xs font-semibold text-emerald-600">ParkEase</p>
              <h2 className="text-2xl font-semibold text-slate-900">시작하기</h2>
              <p className="text-sm text-slate-500">로그인 또는 회원가입 후 예약 화면으로 이동합니다.</p>
            </div>

            <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">로그인</TabsTrigger>
                <TabsTrigger value="signup">회원가입</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-3">
                  <Input
                    placeholder="학교 이메일"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs text-slate-500">사용자 유형</p>
                  <Tabs value={role} onValueChange={(value) => setRole(value as 'STUDENT' | 'STAFF')}>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="STUDENT">학생</TabsTrigger>
                      <TabsTrigger value="STAFF">교직원</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button className="w-full" onClick={handleLogin} disabled={loading}>
                  {loading ? '로그인 중...' : '로그인'}
                </Button>
                <p className="text-xs text-slate-400">
                  데모 로그인입니다. 더미 토큰이 저장됩니다.
                </p>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-3">
                  <Input
                    placeholder="이름"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <Input
                    placeholder="학교 이메일"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs text-slate-500">사용자 유형</p>
                  <Tabs value={role} onValueChange={(value) => setRole(value as 'STUDENT' | 'STAFF')}>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="STUDENT">학생</TabsTrigger>
                      <TabsTrigger value="STAFF">교직원</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button className="w-full" onClick={handleRegister} disabled={loading}>
                  {loading ? '가입 중...' : '회원가입'}
                </Button>
                <p className="text-xs text-slate-400">
                  가입 즉시 예약 화면으로 이동합니다.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
