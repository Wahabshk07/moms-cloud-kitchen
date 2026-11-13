import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

import { CategoryPicker, ControlledInput, ControlledSwitch, FormError, ImagePickerField, IngredientsEditor } from '@/components/common';
import { Button, ErrorState, Header, LoadingState, Screen } from '@/components/ui';
import { useCategories, useDeleteProduct, useProduct, useSaveProduct } from '@/hooks';
import { api } from '@/services/api';
import { spacing } from '@/theme';
import type { UploadFile } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { productSchema, type ProductFormValues } from '@/utils/validation';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productQuery = useProduct(id);
  const categories = useCategories(true);
  const save = useSaveProduct(id);
  const remove = useDeleteProduct();
  const product = productQuery.data;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<UploadFile | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (!product || hydrated) return;
    reset({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      categoryId: product.categoryId ?? '',
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
      isPopular: product.isPopular,
    });
    setIngredients(product.ingredients);
    setImageUri(product.imageUrl);
    setHydrated(true);
  }, [product, hydrated, reset]);

  if (productQuery.isLoading) {
    return (
      <Screen safeArea="tabs" header={<Header title="Edit product" back />}>
        <LoadingState />
      </Screen>
    );
  }

  if (productQuery.error || !product) {
    return (
      <Screen safeArea="tabs" header={<Header title="Edit product" back />}>
        <ErrorState message={getErrorMessage(productQuery.error, 'Product not found')} onRetry={() => void productQuery.refetch()} />
      </Screen>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      let image: string | null | undefined;
      if (pendingFile) image = await api.upload.image(pendingFile);
      else if (removeImage) image = null;
      else image = undefined;

      await save.mutateAsync({
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        categoryId: values.categoryId,
        ingredients,
        isAvailable: values.isAvailable,
        isFeatured: values.isFeatured,
        isPopular: values.isPopular,
        ...(image !== undefined ? { image } : {}),
      });
      router.back();
    } catch (e) {
      setServerError(getErrorMessage(e, 'Could not update product.'));
    }
  });

  const onDelete = () => {
    Alert.alert('Delete product', 'Historical orders keep their item snapshots. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove.mutateAsync(id);
            router.back();
          } catch (e) {
            setServerError(getErrorMessage(e, 'Could not delete product.'));
          }
        },
      },
    ]);
  };

  return (
    <Screen safeArea="tabs" scroll keyboard header={<Header title="Edit product" back />}>
      <FormError message={serverError} />
      <View style={styles.form}>
        <ImagePickerField
          uri={imageUri}
          onPick={(file) => {
            setPendingFile(file);
            setRemoveImage(false);
            setImageUri(file.uri);
          }}
          onRemove={() => {
            setPendingFile(null);
            setRemoveImage(true);
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
            <CategoryPicker categories={categories.data ?? []} value={value} onChange={onChange} error={error?.message} />
          )}
        />
        <IngredientsEditor value={ingredients} onChange={setIngredients} />
        <ControlledSwitch control={control} name="isAvailable" label="Available" />
        <ControlledSwitch control={control} name="isFeatured" label="Featured on home" />
        <ControlledSwitch control={control} name="isPopular" label="Popular" />
        <Button
          label="Save changes"
          loading={save.isPending || isSubmitting}
          disabled={!isValid}
          onPress={onSubmit}
        />
        <Button label="Delete product" variant="danger" loading={remove.isPending} onPress={onDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg, paddingBottom: spacing.xxl },
});
