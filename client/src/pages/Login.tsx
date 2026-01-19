import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/server';
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
  const mapServerUser = (serverUser: { id: string; name: string; userType?: string }) => ({
    id: serverUser.id,
    name: serverUser.name,
    role: serverUser.userType === 'STAFF' ? 'STAFF' : 'STUDENT',
  });
  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await loginUser({ id: email.trim(), password });
      const mappedUser = mapServerUser(result.user);
      login(mappedUser, result.token);
      toast({ title: '로그인 성공', description: `${mappedUser.name}님 환영합니다.` });
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
      const result = await registerUser({
        id: email.trim(),
        password,
        name: name.trim(),
        userType: role,
        carNumber: null,
      });
      const mappedUser = mapServerUser(result.user);
      login(mappedUser, result.token);
      toast({ title: '회원가입 완료', description: `${mappedUser.name}님 환영합니다.` });
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
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_50%,#ecfdf5_50%,#ecfdf5_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.06),transparent_40%)]" />
      </div>

      <div className="relative">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm text-slate-600">
          <button
            type="button"
            onClick={() => scrollTo('service')}
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">P</span>
            <span className="text-slate-900">ParkEase</span>
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            <button
              type="button"
              onClick={() => scrollTo('service')}
              className="text-slate-500 hover:text-slate-900"
            >
              서비스
            </button>
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className="text-slate-500 hover:text-slate-900"
            >
              기능
            </button>
            <button
              type="button"
              onClick={() => scrollTo('pricing')}
              className="text-slate-500 hover:text-slate-900"
            >
              가격
            </button>
            <button
              type="button"
              onClick={() => scrollTo('support')}
              className="text-slate-500 hover:text-slate-900"
            >
              고객센터
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-9 px-3 text-emerald-700 hover:bg-emerald-50"
              onClick={() => scrollTo('support')}
            >
              문의하기
            </Button>
            <Button
              className="h-9 rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
              onClick={() => {
                setTab('login');
                scrollTo('auth-card');
              }}
            >
              로그인
            </Button>
          </div>
        </header>
      </div>

      <div id="service" className="relative mx-auto grid min-h-[calc(100vh-84px)] max-w-6xl items-center gap-10 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 text-slate-900">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            캠퍼스 스마트 주차
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            여석 데이터로
            <br />
            주차 흐름을 바꾸다
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">
            실시간 센서 기반으로 주차장 혼잡도를 예측하고,
            예약 가능한 구역을 추천합니다. 입차 전부터
            효율적인 이동 동선을 확인하세요.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-emerald-100 bg-white px-3 py-1">실시간 여석</span>
            <span className="rounded-full border border-emerald-100 bg-white px-3 py-1">예약 홀드 15분</span>
            <span className="rounded-full border border-emerald-100 bg-white px-3 py-1">친환경 캠퍼스</span>
          </div>
        </section>

        <div className="relative flex items-center justify-center">
          <div className="absolute right-10 top-0 hidden w-56 rounded-2xl border border-emerald-100 bg-white/90 p-4 text-xs text-slate-600 shadow-xl backdrop-blur lg:block">
            <p className="text-sm font-semibold text-slate-900">오늘의 혼잡 예측</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span>오전 9시</span>
                <span className="font-semibold text-emerald-600">여유</span>
              </div>
              <div className="flex items-center justify-between">
                <span>오후 1시</span>
                <span className="font-semibold text-emerald-600">보통</span>
              </div>
              <div className="flex items-center justify-between">
                <span>오후 6시</span>
                <span className="font-semibold text-emerald-700">혼잡</span>
              </div>
            </div>
          </div>

          <div id="auth-card" className="w-full max-w-md rounded-[28px] border border-emerald-100/70 bg-white/90 p-6 shadow-2xl backdrop-blur">
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

      <section id="features" className="relative mx-auto max-w-6xl px-6 pb-16 pt-4">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: '실시간 여석',
              desc: '센서 기반 데이터로 주차 흐름을 즉시 반영합니다.',
            },
            {
              title: '예약 홀드',
              desc: '15분 홀드로 도착 전 자리를 안전하게 확보합니다.',
            },
            {
              title: '동선 안내',
              desc: '가장 가까운 구역을 안내해 시간을 절약합니다.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-700">요금 안내</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">캠퍼스 구성원은 무료로 이용</p>
              <p className="mt-1 text-xs text-slate-500">외부 방문객 요금은 별도 안내됩니다.</p>
            </div>
            <Button
              className="rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
              onClick={() => {
                setTab('signup');
                scrollTo('auth-card');
              }}
            >
              무료로 시작하기
            </Button>
          </div>
        </div>
      </section>

      <section id="support" className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">문의/고객센터</p>
            <p className="mt-2 text-xs text-slate-500">support@parkease.edu · 09:00-18:00</p>
            <p className="mt-3 text-xs text-slate-500">학교 주차 담당 부서와 연동됩니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 text-xs text-slate-500 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">자주 묻는 질문</p>
            <ul className="mt-3 space-y-2">
              <li>예약은 15분 내 입차 확인이 필요합니다.</li>
              <li>만석이면 대기 알림만 표시됩니다.</li>
              <li>역할별 권한은 추후 업데이트됩니다.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
