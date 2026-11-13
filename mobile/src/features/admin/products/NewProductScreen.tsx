import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { CategoryPicker, ControlledInput, ControlledSwitch, FormError, ImagePickerField, IngredientsEditor } from '@/components/common';
import { Button, Header, Screen } from '@/components/ui';
import { useCategories, useSaveProduct } from '@/hooks';
import { api } from '@/services/api';
import { spacing } from '@/theme';
import type { UploadFile } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { productSchema, type ProductFormValues } from '@/utils/validation';

export default function NewProductScreen() {
  const router = useRouter();
  const categories = useCategories(true);
  const save = useSaveProduct();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<UploadFile | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: '',
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      let image: string | undefined;
      if (pendingFile) image = await api.upload.image(pendingFile);
      await save.mutateAsync({
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        categoryId: values.categoryId,
        ingredients,
        isAvailable: values.isAvailable,
        isFeatured: values.isFeatured,
        isPopular: values.isPopular,
        image: image ?? null,
      });
      router.back();
    } catch (e) {
      setServerError(getErrorMessage(e, 'Could not save product.'));
    }
  });

  return (
    <Screen safeArea="tabs" scroll keyboard header={<Header title="New product" back />}>
      <FormError message={serverError} />
      <View style={styles.form}>
        <ImagePickerField
          uri={imageUri}
          onPick={(file) => {
            setPendingFile(file);
            setImageUri(file.uri);
          }}
          onRemove={() => {
            setPendingFile(null);
            setImageUri(null);
          }}
        />
        <ControlledInput control={control} name="name" label="Name" />
        <ControlledInput
          control={control}
          name="description"
          label="Description"
          placeholder="Describe the dish (required)"
          multiline
        />
        <ControlledInput control={control} name="price" label="Price" keyboardType="decimal-pad" />
        <Controller
          control={control}
          name="categoryId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <CategoryPicker
              categories={categories.data ?? []}
              value={value}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />
        <IngredientsEditor value={ingredients} onChange={setIngredients} />
        <ControlledSwitch control={control} name="isAvailable" label="Available" />
        <ControlledSwitch control={control} name="isFeatured" label="Featured on home" />
        <ControlledSwitch control={control} name="isPopular" label="Popular" />
        <Button
          label="Save product"
          loading={save.isPending || isSubmitting}
          disabled={!isValid}
          onPress={onSubmit}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg, paddingBottom: spacing.xxl },
});
