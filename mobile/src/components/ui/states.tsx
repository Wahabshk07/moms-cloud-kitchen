import type { LucideIcon } from 'lucide-react-native';
import { AlertCircle, Check, Inbox } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { Skeleton, SkeletonCard } from './Skeleton';
import { Text } from './Text';

interface StateShellProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  children?: ReactNode;
}

function StateShell({ icon, title, message, children }: StateShellProps) {
  return (
    <View style={styles.shell}>
      <GlassCard intensity="strong" elevated style={styles.panel}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <Text variant="h2" align="center">
          {title}
        </Text>
        {message ? (
          <Text color="secondary" align="center" style={styles.message}>
            {message}
          </Text>
        ) : null}
        {children ? <View style={styles.actions}>{children}</View> : null}
      </GlassCard>
    </View>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <StateShell icon={<Icon size={26} color={colors.blue} strokeWidth={1.6} />} title={title} message={message}>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} fullWidth={false} /> : null}
    </StateShell>
  );
}

export function LoadingState({ label }: { label?: string }) {
  return (
    <View style={styles.shell}>
      <ActivityIndicator color={colors.blue} />
      {label ? (
        <Text color="secondary" variant="caption" style={{ marginTop: spacing.md }}>
          {label}
        </Text>
      ) : null}
      <View style={styles.skeletonRow}>
        <SkeletonCard style={{ flex: 1 }} />
        <SkeletonCard style={{ flex: 1 }} />
      </View>
      <Skeleton height={14} width="55%" style={{ marginTop: spacing.lg }} />
      <Skeleton height={12} width="35%" style={{ marginTop: spacing.sm }} />
    </View>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <StateShell
      icon={<AlertCircle size={26} color={colors.black} strokeWidth={1.6} />}
      title={title}
      message={message ?? 'We could not load this right now. Please try again.'}
    >
      {onRetry ? <Button label="Try again" variant="secondary" onPress={onRetry} fullWidth={false} /> : null}
    </StateShell>
  );
}

export function SuccessState({
  title,
  message,
  children,
}: {
  title: string;
  message?: string;
  children?: ReactNode;
}) {
  return (
    <StateShell
      icon={
        <View style={styles.successDot}>
          <Check size={28} color={colors.white} strokeWidth={2.2} />
        </View>
      }
      title={title}
      message={message}
    >
      {children}
    </StateShell>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  successDot: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.deepBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { maxWidth: 300 },
  actions: { marginTop: spacing.lg, alignSelf: 'stretch', alignItems: 'center' },
  skeletonRow: { flexDirection: 'row', gap: spacing.md, width: '100%', marginTop: spacing.xl },
});
