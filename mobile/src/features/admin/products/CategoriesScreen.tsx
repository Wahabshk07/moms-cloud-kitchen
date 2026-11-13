import { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { FormError } from '@/components/common';
import { Button, EmptyState, ErrorState, Header, Input, LoadingState, Screen, Text } from '@/components/ui';
import { useCategories, useDeleteCategory, useRefresh, useSaveCategory } from '@/hooks';
import { spacing } from '@/theme';
import { getErrorMessage } from '@/utils/errors';

export default function CategoriesScreen() {
  const categories = useCategories(true);
  const save = useSaveCategory();
  const remove = useDeleteCategory();
  const { refreshing, onRefresh } = useRefresh(() => categories.refetch());
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onCreate = async () => {
    if (name.trim().length < 2) {
      setError('Enter a category name.');
      return;
    }
    setError(null);
    try {
      await save.mutateAsync({ payload: { name: name.trim() } });
      setName('');
      await categories.refetch();
    } catch (e) {
      setError(getErrorMessage(e, 'Could not create category.'));
    }
  };

  return (
    <Screen safeArea="stack" padded={false} header={<Header title="Categories" back />}>
      <View style={styles.composer}>
        <FormError message={error} />
        <Input label="New category" value={name} onChangeText={setName} placeholder="e.g. Soups" />
        <Button label="Add category" loading={save.isPending} onPress={() => void onCreate()} />
      </View>

      {categories.isLoading && !categories.data ? (
        <LoadingState />
      ) : categories.error && !categories.data ? (
        <ErrorState message={getErrorMessage(categories.error)} onRetry={onRefresh} />
      ) : (categories.data?.length ?? 0) === 0 ? (
        <EmptyState title="No categories" message="Add Main Course, Rice, Snacks, and more." />
      ) : (
        <FlatList
          data={categories.data}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text variant="h3" style={{ flex: 1 }}>
                {item.name}
              </Text>
              <Button
                label="Delete"
                variant="ghost"
                size="sm"
                fullWidth={false}
                onPress={() =>
                  Alert.alert('Delete category', `Remove ${item.name}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => void remove.mutateAsync(item.id).then(() => categories.refetch()),
                    },
                  ])
                }
              />
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  composer: { paddingHorizontal: spacing.lg, gap: spacing.md, marginBottom: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
