export async function fetchActivityLog(currentDate) {
  const response = await fetch('/api/aktiviteter/logg');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }
  const logEntries = await response.json();
  let entries = checkForNewEntries(logEntries, currentDate);

  // Counts the number of each activity
  let newerEntries = entries[0].reduce((result, entry) => {
    if (!(entry.activity in result)) {
      result[entry.activity] = 0;
    }
    result[entry.activity] += 1;
    return result;
  }, {});

  let newEntries = entries[1].reduce((result, entry) => {
    if (!(entry.activity in result)) {
      result[entry.activity] = 0;
    }
    result[entry.activity] += 1;
    return result;
  }, {});

  return [newerEntries, newEntries];
}

export function checkForNewEntries(logEntries, currentDate) {
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentWeek = getWeekDate(currentDate);

  for (let entry of logEntries) {
    const entryDate = new Date(entry.date);
    const acceptedEntry = isNewDate(entryDate, currentWeek, currentDay, currentHour);

    if (acceptedEntry[0]) {
      entry.thisHour = true;
    } else if (acceptedEntry[1]) {
      entry.thisWeek = true;
    }
  }
  let newerEntries = logEntries.filter((el) => {
    return el.thisHour;
  });
  let newEntries = logEntries.filter((el) => {
    return el.thisWeek;
  });
  return [newerEntries, newEntries];
}

export function getWeekDate(date) {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);

  return weekNumber;
}

export function isNewDate(entryDate, currentWeek, currentDay, currentHour) {
  const week = getWeekDate(entryDate);
  const day = entryDate.getDate();
  const hour = entryDate.getHours();
  let pastHour = false;
  let earlierThisWeek = false;

  if (week >= currentWeek) {
    // Checks for present day and closest 2 hours
    if (day === currentDay && currentHour - hour < 2) {
      pastHour = true;
    } else {
      earlierThisWeek = true;
    }
  }
  return [pastHour, earlierThisWeek];
}
