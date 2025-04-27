// intervalManager.ts
const intervalMap = new Map<string, NodeJS.Timeout>();

export function startInterval(id: string, callback: () => void, delay: number) {
  if (intervalMap.has(id)) {
    console.log(`Interval with id ${id} already exists.`);
    return;
  }

  const interval = setInterval(callback, delay);
  intervalMap.set(id, interval);
  console.log(`Started interval with id ${id}`);
}

export function clearIntervalById(id: string) {
  const interval = intervalMap.get(id);
  if (interval) {
    clearInterval(interval);
    intervalMap.delete(id);
    console.log(`Cleared interval with id ${id}`);
  } else {
    console.log(`No interval found with id ${id}`);
  }
}
