// Independent owners: releasing one finger/key must not release another.
export function updateHeld(owners: Set<string>, owner: string, held: boolean): boolean {
  if (held) owners.add(owner)
  else owners.delete(owner)
  return owners.size > 0
}
