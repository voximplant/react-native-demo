import { LocalPreviewVideo, LocalPreviewVideoToggle } from '@/shared/components'
import { FAB, Separator } from '@/shared/ui'
import { ACTION_BAR_SIZES, SPACING } from '@/styles/theme'
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native'
import { JoinForm } from '../components'
import { useJoinForm } from '../hooks'

export const JoinView = () => {
  const joinForm = useJoinForm()

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <LocalPreviewVideo style={styles.video} />

        <LocalPreviewVideoToggle />

        <Separator />

        {joinForm.formState.isLoading ? (
          <ActivityIndicator />
        ) : (
          <JoinForm control={joinForm.control} />
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon={joinForm.fabIcon}
        label={joinForm.fabLabel}
        onPress={() => joinForm.onJoin()}
      />
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    gap: SPACING.m,
    paddingBottom: SPACING.content + ACTION_BAR_SIZES.sm
  },
  video: { height: 280 },
  fab: {
    position: 'absolute',
    bottom: SPACING.content,
    right: SPACING.content
  }
})
