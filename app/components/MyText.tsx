import { Text as DefaultText, TextProps } from "react-native";

export default function Text(props: TextProps) {
  const { className, ...otherProps } = props;

  return <DefaultText className={className + " font-sans"} {...otherProps} />;
}
