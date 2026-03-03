'use client';

import { useRef, useEffect } from 'react';
import {
  Deck,
  Slide,
  Heading,
  Text,
  Image,
  Box,
  FlexBox,
  OrderedList,
  ListItem,
  CodeSpan,
  Appear,
  DefaultTemplate,
  Notes,
} from 'spectacle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Spectacle 主题配置 - 浅色背景主题
const theme = {
  fonts: {
    header: '"Noto Sans SC", sans-serif',
    text: '"Noto Sans SC", sans-serif',
    monospace: '"Fira Code", monospace',
  },
  colors: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#e2e8f0',
    quaternary: '#3b82f6',
    quinary: '#8b5cf6',
    // 自定义文本颜色
    text: '#1e293b',
    textMuted: '#64748b',
    accent: '#3b82f6',
  },
};

// GSAP 动画登录幻灯片组件
function LoginAnimationSlide() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
    });

    // 步骤1: 显示 WPS 界面
    tl.fromTo(
      '.login-step-1',
      { opacity: 0, scale: 0.8, x: -50 },
      { opacity: 1, scale: 1, x: 0, duration: 0.8, ease: 'back.out(1.7)' }
    );

    // 步骤2: 点击登录按钮动画
    tl.to('.login-btn', {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    // 步骤3: 显示箭头
    tl.fromTo(
      '.login-arrow',
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    );

    // 步骤4: 显示 SSO 界面
    tl.fromTo(
      '.login-step-2',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.2'
    );

    // 步骤5: 输入框动画
    tl.fromTo(
      '.login-input',
      { width: 0 },
      { width: '100%', duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );

    // 步骤6: 登录成功
    tl.fromTo(
      '.login-success',
      { opacity: 0, scale: 0.5, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
      '+=0.8'
    );

    // 步骤7: 重置
    tl.to(['.login-step-1', '.login-step-2', '.login-success', '.login-arrow'], {
      opacity: 0,
      duration: 0.4,
      delay: 2,
    });

  }, { scope: containerRef });

  return (
    <Box
      ref={containerRef}
      height="100%"
      padding="2rem"
      style={{ backgroundColor: '#f1f5f9' }}
    >
      <Heading
        fontSize="h3"
        style={{ color: '#1e293b', textAlign: 'left', marginBottom: '1.5rem' }}
      >
        登录机构账号 - 时序动画演示
      </Heading>

      <FlexBox
        height="65%"
        justifyContent="center"
        alignItems="center"
        gap="2rem"
      >
        {/* 步骤 1: WPS 界面 */}
        <Box
          className="login-step-1"
          padding="1.5rem"
          width="240px"
          opacity={0}
          style={{
            backgroundColor: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Text style={{ color: '#1e293b', fontSize: '1.1rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 600 }}>
            WPS Office
          </Text>
          <Box
            className="login-btn"
            padding="0.7rem 1.2rem"
            style={{
              backgroundColor: '#3b82f6',
              borderRadius: '0.5rem',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <Text style={{ color: '#fff', fontSize: '0.95rem', margin: 0 }}>
              机构登录
            </Text>
          </Box>
        </Box>

        {/* 箭头 */}
        <Box className="login-arrow" opacity={0} style={{ color: '#94a3b8' }}>
          <Text style={{ fontSize: '2rem', margin: 0 }}>→</Text>
        </Box>

        {/* 步骤 2: SSO 登录界面 */}
        <Box
          className="login-step-2"
          padding="1.5rem"
          width="240px"
          opacity={0}
          style={{
            backgroundColor: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Text style={{ color: '#1e293b', fontSize: '1.1rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 600 }}>
            中国传媒大学 SSO
          </Text>
          <Box
            style={{
              backgroundColor: '#f1f5f9',
              padding: '0.6rem',
              borderRadius: '0.4rem',
              marginBottom: '0.8rem',
              overflow: 'hidden',
            }}
          >
            <Text
              className="login-input"
              style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, whiteSpace: 'nowrap' }}
            >
              学号/工号
            </Text>
          </Box>
          <Box
            style={{
              backgroundColor: '#3b82f6',
              padding: '0.6rem 1rem',
              borderRadius: '0.4rem',
              textAlign: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: '0.85rem', margin: 0 }}>
              登录
            </Text>
          </Box>
        </Box>

        {/* 成功提示 */}
        <Box
          className="login-success"
          padding="0.8rem 1.5rem"
          opacity={0}
          style={{
            backgroundColor: '#22c55e',
            borderRadius: '2rem',
            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
          }}
        >
          <Text style={{ color: '#fff', fontSize: '1rem', margin: 0, fontWeight: 500 }}>
            登录成功!
          </Text>
        </Box>
      </FlexBox>

      <Text style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>
        GSAP Timeline Animation - 自动循环演示登录流程
      </Text>
    </Box>
  );
}

// 普通幻灯片内容组件
function SlideContent({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <FlexBox height="100%" flexDirection="column" padding="2rem 3rem">
      <Heading
        fontSize="h2"
        style={{ color: '#1e293b', textAlign: 'left', marginBottom: '1.5rem' }}
      >
        {title}
      </Heading>
      <Box width="100%">{children}</Box>
    </FlexBox>
  );
}

// 主幻灯片组件
export function WPSSpectacleDeck() {
  const basePath = '/courses-react';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      backgroundColor: '#f8fafc',
    }}>
      <Deck
        theme={theme}
        template={<DefaultTemplate />}
      >
      {/* 封面 */}
      <Slide backgroundColor="#1e40af">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Heading fontSize="h1" style={{ color: '#fff', textAlign: 'center' }}>
            AI-WPS
          </Heading>
          <Heading fontSize="h3" style={{ color: '#93c5fd', textAlign: 'center', marginTop: '1rem' }}>
            辅助办公
          </Heading>
          <Text style={{ color: '#bfdbfe', fontSize: '1rem', marginTop: '2rem' }}>
            Spectacle + GSAP 技术演示
          </Text>
        </FlexBox>
      </Slide>

      {/* 环境配置 */}
      <Slide backgroundColor="#f8fafc">
        <SlideContent title="环境配置">
          <OrderedList style={{ color: '#1e293b', fontSize: '1.2rem' }}>
            <Appear><ListItem>下载 WPS 教育版或官方版</ListItem></Appear>
            <Appear><ListItem>机构登录（SSO）</ListItem></Appear>
            <Appear><ListItem>开始使用 AI 功能</ListItem></Appear>
          </OrderedList>
        </SlideContent>
      </Slide>

      {/* 下载 WPS */}
      <Slide backgroundColor="#fff">
        <SlideContent title="下载 WPS">
          <Text style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
            信息化处购买了 WPS 教育版，可以选择下载：
          </Text>
          <FlexBox justifyContent="flex-start" gap="1.5rem">
            <Box>
              <CodeSpan style={{ color: '#3b82f6' }}>www.wps.cn</CodeSpan>
              <Text style={{ color: '#64748b', fontSize: '0.9rem' }}>官方版（有灵犀按钮）</Text>
            </Box>
            <Box>
              <CodeSpan style={{ color: '#3b82f6' }}>software.cuc.edu.cn</CodeSpan>
              <Text style={{ color: '#64748b', fontSize: '0.9rem' }}>教育版</Text>
            </Box>
          </FlexBox>
          <Box marginTop="1.5rem">
            <Image
              src={`${basePath}/img/wps-download.png`}
              alt="下载 WPS"
              style={{ width: '65%', borderRadius: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 登录机构账号 - GSAP 动画演示 */}
      <Slide backgroundColor="#f1f5f9">
        <LoginAnimationSlide />
      </Slide>

      {/* 灵犀文章写作 */}
      <Slide backgroundColor="#f8fafc">
        <SlideContent title="灵犀文章写作">
          <Text style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
            利用灵犀实现教案生成、编辑、更新并利用 drawio 解决文档图片的痛点。
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/write-with-lingxi.png`}
              alt="灵犀起草教案"
              style={{ width: '70%', borderRadius: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 灵犀文档内修改 */}
      <Slide backgroundColor="#fff">
        <SlideContent title="灵犀文档内修改">
          <Text style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
            实现文档润色修改
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/modify-with-lingxi.png`}
              alt="灵犀文档内修改"
              style={{ width: '70%', borderRadius: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 智能工具箱 */}
      <Slide backgroundColor="#f8fafc">
        <SlideContent title="智能工具箱">
          <Text style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
            利用智能工具箱操作表格
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/ai-toolbox.png`}
              alt="智能工具箱"
              style={{ width: '70%', borderRadius: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* WPS AI */}
      <Slide backgroundColor="#fff">
        <SlideContent title="WPS AI">
          <Text style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
            利用 WPS AI 操作表格
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/wps-ai.png`}
              alt="WPS AI"
              style={{ width: '70%', borderRadius: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 邮件合并 */}
      <Slide backgroundColor="#f8fafc">
        <SlideContent title="邮件合并批量生成通知">
          <Text style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
            利用邮件合并功能批量生成通知
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/wps-ai-template.png`}
              alt="批量生成文档"
              style={{ width: '70%', borderRadius: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* Q&A */}
      <Slide backgroundColor="#1e40af">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Heading fontSize="h1" style={{ color: '#fff', textAlign: 'center' }}>
            Q & A
          </Heading>
          <Text style={{ color: '#bfdbfe', fontSize: '1rem', marginTop: '2rem' }}>
            感谢观看
          </Text>
        </FlexBox>
      </Slide>
    </Deck>
    </div>
  );
}
