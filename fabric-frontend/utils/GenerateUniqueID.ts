export function GenerateUniqueID(): string {
    return Date.now() + Math.random().toString().slice(-4);
}