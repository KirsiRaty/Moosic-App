const used = {};
const rotationState = {};

// soittolistojen kierto ettei saa samaa peräkkäin
export function getRotatingItem(list, key) {
  if (!list || list.length === 0) return null;

  if (!used[key]) {
    used[key] = [...list];
  }

  if (used[key].length === 0) {
    used[key] = [...list];
  }

  const index = Math.floor(Math.random() * used[key].length);
  const choice = used[key][index];

  used[key].splice(index, 1);

  return choice;
}

// kiertää näin A - B - C - D - A
export function getNextItem(list, key) {
  if (!list || list.length === 0) return null;

  if (!rotationState[key] || rotationState[key].length === 0) {
    rotationState[key] = [...list];
  }

  const next = rotationState[key].shift();

  return next;
}