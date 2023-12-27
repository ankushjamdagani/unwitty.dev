export type PolymorphicAsProp<T extends React.ElementType> = {
  /**
   * html tag name
   */
  as?: T;
};

export type PolymorphicPropsToOmit<
  C extends React.ElementType,
  P,
> = keyof (PolymorphicAsProp<C> & P);

/**
 * Adds support for "as" prop and respective tag props
 */
export type PolymorphicComponent<
  C extends React.ElementType,
  Props = {},
> = Props &
  PolymorphicAsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, PolymorphicPropsToOmit<C, Props>>;
