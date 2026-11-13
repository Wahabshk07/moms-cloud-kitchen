import { Image } from 'expo-image';
import { UtensilsCrossed } from 'lucide-react-native';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

interface FoodImageProps {
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
}

/** expo-image with a quiet vector placeholder (no emoji). */
export function FoodImage({ uri, style, iconSize = 28 }: FoodImageProps) {
  return (
    <View style={[styles.box, style]}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      ) : (
        <UtensilsCrossed size={iconSize} color={colors.silver} strokeWidth={1.4} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
