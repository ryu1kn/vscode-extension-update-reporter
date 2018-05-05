export function escape(pattern: string): string {
  return pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
