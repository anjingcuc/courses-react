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

// Spectacle 主题配置
const theme = {
  fonts: {
    header: '"Noto Sans SC", sans-serif',
    text: '"Noto Sans SC", sans-serif',
    monospace: '"Fira Code", monospace',
  },
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    tertiary: '#0f3460',
    quaternary: '#e94560',
    quinary: '#533483',
  },
};

// GSAP 动画登录幻灯片组件
function LoginAnimationSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // 创建时序动画
    const tl = gsap.timeline({
      repeat: -1, // 无限循环
      repeatDelay: 2,
    });
    timelineRef.current = tl;

    // 步骤1: 显示 WPS 图标
    tl.fromTo(
      '.login-step-1',
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );

    // 步骤2: 点击登录按钮
    tl.to('.login-btn', {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    // 步骤3: 显示 SSO 界面
    tl.fromTo(
      '.login-step-2',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.1'
    );

    // 步骤4: 输入账号动画
    tl.fromTo(
      '.login-input',
      { width: 0 },
      { width: '100%', duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );

    // 步骤5: 登录成功
    tl.fromTo(
      '.login-success',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '+=0.5'
    );

    // 步骤6: 重置动画
    tl.to(['.login-step-1', '.login-step-2', '.login-success'], {
      opacity: 0,
      duration: 0.3,
      delay: 1.5,
    });

  }, { scope: containerRef });

  return (
    <Box
      ref={containerRef}
      height="100%"
      backgroundColor="secondary"
      padding="2rem"
    >
      <Heading fontSize="h2" color="primaryText" textAlign="left" marginBottom="1rem">
        登录机构账号 - 时序动画演示
      </Heading>

      <FlexBox height="70%" justifyContent="center" alignItems="center" gap="3rem">
        {/* 步骤 1: WPS 界面 */}
        <Box
          className="login-step-1"
          backgroundColor="tertiary"
          padding="1.5rem"
          borderRadius="1rem"
          width="280px"
          opacity={0}
        >
          <Text color="primaryText" fontSize="1.2rem" textAlign="center" marginBottom="1rem">
            WPS Office
          </Text>
          <Box
            backgroundColor="quaternary"
            padding="0.8rem 1.5rem"
            borderRadius="0.5rem"
            textAlign="center"
            className="login-btn"
          >
            <Text color="white" fontSize="1rem" margin="0">
              机构登录
            </Text>
          </Box>
        </Box>

        {/* 箭头 */}
        <Box opacity={0.5}>
          <Text color="primaryText" fontSize="2rem">→</Text>
        </Box>

        {/* 步骤 2: SSO 登录界面 */}
        <Box
          className="login-step-2"
          backgroundColor="tertiary"
          padding="1.5rem"
          borderRadius="1rem"
          width="280px"
          opacity={0}
        >
          <Text color="primaryText" fontSize="1.2rem" textAlign="center" marginBottom="1rem">
            中国传媒大学 SSO
          </Text>
          <Box
            backgroundColor="rgba(255,255,255,0.1)"
            padding="0.5rem"
            borderRadius="0.3rem"
            marginBottom="0.8rem"
            overflow="hidden"
          >
            <Text className="login-input" color="secondaryText" fontSize="0.9rem" margin="0" whiteSpace="nowrap">
              学号/工号
            </Text>
          </Box>
          <Box
            backgroundColor="quaternary"
            padding="0.6rem 1rem"
            borderRadius="0.3rem"
            textAlign="center"
          >
            <Text color="white" fontSize="0.9rem" margin="0">
              登录
            </Text>
          </Box>
        </Box>

        {/* 成功提示 */}
        <Box
          className="login-success"
          backgroundColor="#22c55e"
          padding="1rem 2rem"
          borderRadius="2rem"
          opacity={0}
        >
          <Text color="white" fontSize="1.1rem" margin="0">
            登录成功!
          </Text>
        </Box>
      </FlexBox>

      <Text color="secondaryText" fontSize="0.8rem" textAlign="center" marginTop="1rem">
        GSAP Timeline Animation - 自动循环演示登录流程
      </Text>
    </Box>
  );
}

// 普通幻灯片内容组件
function SlideContent({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <FlexBox height="100%" flexDirection="column" alignItems="flex-start" padding="2rem">
      <Heading fontSize="h2" color="primaryText" textAlign="left" marginBottom="1rem">
        {title}
      </Heading>
      <Box width="100%">{children}</Box>
    </FlexBox>
  );
}

// 主幻灯片组件
export function WPSSpectacleDeck() {
  const basePath = '/courses-react';

  // 隐藏 body 滚动条并确保全屏
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
      backgroundColor: '#1a1a2e',
    }}>
      <Deck
        theme={theme}
        template={<DefaultTemplate />}
      >
      {/* 封面 */}
      <Slide backgroundColor="secondary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Heading fontSize="h1" color="primaryText" textAlign="center">
            AI-WPS
          </Heading>
          <Heading fontSize="h3" color="quaternary" textAlign="center" marginTop="1rem">
            辅助办公
          </Heading>
          <Text color="secondaryText" fontSize="1rem" marginTop="2rem">
            Spectacle + GSAP 技术演示
          </Text>
        </FlexBox>
        <Notes>
          这是使用 Spectacle 框架和 GSAP 动画引擎构建的演示文稿。
        </Notes>
      </Slide>

      {/* 环境配置 */}
      <Slide backgroundColor="primary">
        <SlideContent title="环境配置">
          <OrderedList color="primaryText" fontSize="1.2rem">
            <Appear><ListItem>下载 WPS 教育版或官方版</ListItem></Appear>
            <Appear><ListItem>机构登录（SSO）</ListItem></Appear>
            <Appear><ListItem>开始使用 AI 功能</ListItem></Appear>
          </OrderedList>
        </SlideContent>
      </Slide>

      {/* 下载 WPS */}
      <Slide backgroundColor="secondary">
        <SlideContent title="下载 WPS">
          <Text color="secondaryText" fontSize="1rem" marginBottom="1rem" textAlign="left">
            信息化处购买了 WPS 教育版，可以选择下载：
          </Text>
          <FlexBox justifyContent="flex-start" gap="1rem">
            <Box>
              <CodeSpan color="quaternary">www.wps.cn</CodeSpan>
              <Text color="secondaryText" fontSize="0.9rem">官方版（有灵犀按钮）</Text>
            </Box>
            <Box>
              <CodeSpan color="quaternary">software.cuc.edu.cn</CodeSpan>
              <Text color="secondaryText" fontSize="0.9rem">教育版</Text>
            </Box>
          </FlexBox>
          <Box marginTop="1.5rem">
            <Image
              src={`${basePath}/img/wps-download.png`}
              alt="下载 WPS"
              style={{ width: '70%', borderRadius: '0.5rem' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 登录机构账号 - GSAP 动画演示 */}
      <Slide backgroundColor="secondary">
        <LoginAnimationSlide />
      </Slide>

      {/* 灵犀文章写作 */}
      <Slide backgroundColor="primary">
        <SlideContent title="灵犀文章写作">
          <Text color="secondaryText" fontSize="1rem" marginBottom="1rem" textAlign="left">
            利用灵犀实现教案生成、编辑、更新并利用 drawio 解决文档图片的痛点。
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/write-with-lingxi.png`}
              alt="灵犀起草教案"
              style={{ width: '75%', borderRadius: '0.5rem' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 灵犀文档内修改 */}
      <Slide backgroundColor="secondary">
        <SlideContent title="灵犀文档内修改">
          <Text color="secondaryText" fontSize="1rem" marginBottom="1rem" textAlign="left">
            实现文档润色修改
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/modify-with-lingxi.png`}
              alt="灵犀文档内修改"
              style={{ width: '75%', borderRadius: '0.5rem' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 智能工具箱 */}
      <Slide backgroundColor="primary">
        <SlideContent title="智能工具箱">
          <Text color="secondaryText" fontSize="1rem" marginBottom="1rem" textAlign="left">
            利用智能工具箱操作表格
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/ai-toolbox.png`}
              alt="智能工具箱"
              style={{ width: '75%', borderRadius: '0.5rem' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* WPS AI */}
      <Slide backgroundColor="secondary">
        <SlideContent title="WPS AI">
          <Text color="secondaryText" fontSize="1rem" marginBottom="1rem" textAlign="left">
            利用 WPS AI 操作表格
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/wps-ai.png`}
              alt="WPS AI"
              style={{ width: '75%', borderRadius: '0.5rem' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* 邮件合并 */}
      <Slide backgroundColor="primary">
        <SlideContent title="邮件合并批量生成通知">
          <Text color="secondaryText" fontSize="1rem" marginBottom="1rem" textAlign="left">
            利用邮件合并功能批量生成通知
          </Text>
          <Box>
            <Image
              src={`${basePath}/img/wps-ai-template.png`}
              alt="批量生成文档"
              style={{ width: '75%', borderRadius: '0.5rem' }}
            />
          </Box>
        </SlideContent>
      </Slide>

      {/* Q&A */}
      <Slide backgroundColor="secondary">
        <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <Heading fontSize="h1" color="primaryText" textAlign="center">
            Q & A
          </Heading>
          <Text color="secondaryText" fontSize="1rem" marginTop="2rem">
            感谢观看
          </Text>
        </FlexBox>
      </Slide>
    </Deck>
    </div>
  );
}
