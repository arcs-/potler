type EmptyObj = Record<PropertyKey, never>
type Something<T> = Exclude<T, null | undefined | EmptyObj>
type Enforce<Type> = {
  [Key in keyof Type]-?: Enforce<Something<Type[Key]>>
}
