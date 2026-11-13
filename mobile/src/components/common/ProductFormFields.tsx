import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Input, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';
import type { Category, UploadFile } from '@/types';
import { CategoryChip } from './CategoryChip';
import { FoodImage } from './FoodImage';

/* ---------- Image picker ---------- */

interface ImagePickerFieldProps {
  /** Currently displayed image (remote URL or local file URI). */
  uri: string | null;
  onPick: (file: UploadFile) => void;
  onRemove: () => void;
}

export function ImagePickerField({ uri, onPick, onRemove }: ImagePickerFieldProps) {
  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow photo library access to upload a menu image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    onPick({ uri: asset.uri, name: asset.fileName, mimeType: asset.mimeType });
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="label" color="secondary">
        Photo
      </Text>
      <Pressable onPress={pick} accessibilityRole="button" accessibilityLabel="Choose photo">
        {uri ? (
          <Image source={{ uri }} style={styles.preview} contentFit="cover" />
        ) : (
          <View style={[styles.preview, styles.placeholder]}>
            <ImagePlus size={28} color={colors.blue} strokeWidth={1.5} />
            <Text variant="bodyMedium" color="blue">
              Add a photo
            </Text>
          </View>
        )}
      </Pressable>
      {uri ? (
        <View style={styles.imageActions}>
          <Button label="Change" variant="secondary" size="sm" fullWidth={false} onPress={pick} />
          <Button label="Remove" variant="ghost" size="sm" fullWidth={false} onPress={onRemove} />
        </View>
      ) : null}
    </View>
  );
}

/* ---------- Ingredients ---------- */

interface IngredientsEditorProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function IngredientsEditor({ value, onChange }: IngredientsEditorProps) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const parts = draft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (parts.length > 0) onChange([...value, ...parts]);
    setDraft('');
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <Input
        label="Ingredients"
        placeholder="Add an ingredient"
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={add}
        returnKeyType="done"
        blurOnSubmit={false}
        hint="Separate several with commas."
        right={
          <Pressable onPress={add} hitSlop={8} accessibilityLabel="Add ingredient">
            <Plus size={20} color={colors.blue} />
          </Pressable>
        }
      />
      {value.length > 0 ? (
        <View style={styles.chips}>
          {value.map((item) => (
            <View key={item} style={styles.ingredient}>
              <Text variant="caption">{item}</Text>
              <Pressable
                onPress={() => onChange(value.filter((v) => v !== item))}
                hitSlop={8}
                accessibilityLabel={`Remove ${item}`}
              >
                <X size={14} color={colors.textSecondary} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/* ---------- Category picker ---------- */

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
  error?: string;
}

export function CategoryPicker({ categories, value, onChange, error }: CategoryPickerProps) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="label" color="secondary">
        Category
      </Text>
      {categories.length === 0 ? (
        <Text variant="caption" color="secondary">
          No categories yet. Create one under Categories first.
        </Text>
      ) : (
        <View style={styles.chips}>
          {categories.map((c) => (
            <CategoryChip key={c.id} label={c.name} selected={value === c.id} onPress={() => onChange(c.id)} />
          ))}
        </View>
      )}
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

/* ---------- Ingredient list (read-only) ---------- */

export function IngredientList({ items }: { items: string[] }) {
  return (
    <View style={styles.chips}>
      {items.map((item) => (
        <View key={item} style={styles.ingredientStatic}>
          <Text variant="caption">{item}</Text>
        </View>
      ))}
    </View>
  );
}

/* ---------- Preview ---------- */

export function ProductPreview({
  name,
  price,
  imageUri,
}: {
  name: string;
  price: string;
  imageUri: string | null;
}) {
  const priceNum = Number(price);
  return (
    <View style={styles.previewCard}>
      <FoodImage uri={imageUri} style={styles.previewThumb} />
      <View style={{ flex: 1 }}>
        <Text variant="h3" numberOfLines={1}>
          {name || 'Dish name'}
        </Text>
        <Text variant="price" color="blue">
          {Number.isFinite(priceNum) && priceNum > 0 ? `Rs. ${priceNum}` : 'Rs. —'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.lg },
  placeholder: {
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.blue,
  },
  imageActions: { flexDirection: 'row', gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.bgMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ingredientStatic: {
    paddingHorizontal: spacing.md,
    height: 30,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.bgMuted,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.bgMuted,
  },
  previewThumb: { width: 64, height: 64, borderRadius: radius.md },
});
