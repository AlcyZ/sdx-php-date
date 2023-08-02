// Create an array with the number of days in each month (non-leap year)
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const dayMap = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const monthMap = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function addLeadingZeros(to: number, amount: number = 2): string {
    const str = Math.abs(to).toString();
    const leadingZeros = Math.max(0, amount - str.length);
    const zerosStr = '0'.repeat(leadingZeros);

    return to < 0 ? `-${zerosStr}${str}` : `${zerosStr}${str}`;
}

function isLeapYear(year: number): boolean {
    // A year is a leap year if it is divisible by 4,
    // except for years that are divisible by 100.
    // However, years that are divisible by 400 are leap years.
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date) {
    const year = date.getFullYear();
    const isLeap = isLeapYear(year);

    // Update the days in February for leap years
    if (isLeap) {
        daysInMonth[1] = 29;
    }

    // Get the month (0-11) and day (1-31) of the given date
    const month = date.getMonth();
    const day = date.getDate();

    // Calculate the day of the year by summing the days of all previous months
    let dayOfYear = 0;
    for (let i = 0; i < month; i++) {
        dayOfYear += daysInMonth[i];
    }

    // Add the days of the current month
    dayOfYear += day;

    return dayOfYear;
}

function getISOWeekNumber(date: Date) {
    // Create a new date object to avoid modifying the original date
    const d = new Date(date);

    d.setHours(0, 0, 0, 0);

    // Thursday will be in the same ISO week as the target date
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));

    // The first week of the year contains January 4th
    const yearStart = new Date(d.getFullYear(), 0, 4);

    // Calculate the week number by counting the weeks between January 4th and the target date
    // @ts-ignore
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

const tokenCallbacks: Record<string, (date: Date) => string> = {
    // --- Day
    // Day of the month, 2 digits with leading zeros 	01 to 31
    d: (date: Date): string => {
        return addLeadingZeros(date.getDate());
    },

    // A textual representation of a day, three letters 	Mon through Sun
    D: (date: Date): string => {
        return dayMap[date.getDay()].slice(0, 3);
    },

    // Day of the month without leading zeros 	1 to 31
    j: (date: Date): string => {
        return date.getDate().toString();
    },

    // A full textual representation of the day of the week 	Sunday through Saturday
    l: (date: Date): string => {
        return dayMap[date.getDay()];
    },

    // ISO 8601 numeric representation of the day of the week 	1 (for Monday) through 7 (for Sunday)
    N: (date: Date): string => {
        return (date.getDay() + 1).toString();
    },

    // English ordinal suffix for the day of the month, 2 characters 	st, nd, rd or th. Works well with j
    S: (date: Date): string => {
        const map = ['st', 'nd', 'rd'];
        return map[date.getDate() - 1] || 'th';
    },

    // Numeric representation of the day of the week 	0 (for Sunday) through 6 (for Saturday)
    w: (date: Date): string => {
        return date.getDay().toString();
    },

    // The day of the year (starting from 0) 	0 through 365
    z: (date: Date): string => {
        return getDayOfYear(date).toString();
    },

    // --- Week
    // ISO 8601 week number of year, weeks starting on Monday 	Example: 42 (the 42nd week in the year)
    W: (date: Date): string => {
        return getISOWeekNumber(date).toString();
    },

    // --- Month
    // A full textual representation of a month, such as January or March 	January through December
    F: (date: Date): string => {
        return monthMap[date.getMonth()];
    },

    // Numeric representation of a month, with leading zeros 	01 through 12
    m: (date: Date): string => {
        return addLeadingZeros(date.getMonth() + 1);
    },

    // A short textual representation of a month, three letters 	Jan through Dec
    M: (date: Date): string => {
        return monthMap[date.getMonth()].slice(0, 3);
    },

    // Numeric representation of a month, without leading zeros 	1 through 12
    n: (date: Date): string => {
        return (date.getMonth() + 1).toString();
    },

    // Number of days in the given month 	28 through 31
    t: (date: Date): string => {
        const month = date.getMonth();
        if (month === 1 && isLeapYear(date.getFullYear())) {
            return '29';
        }
        return daysInMonth[date.getMonth()].toString();
    },

    // --- Year
    // Whether it's a leap year 	1 if it is a leap year, 0 otherwise.
    L: (date: Date): string => {
        return isLeapYear(date.getFullYear()) ? '1' : '0';
    },

    // ISO 8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. 	Examples: 1999 or 2003
    o: (date: Date): string => {
        return date.getFullYear().toString();
    },

    // An expanded full numeric representation of a year, at least 4 digits, with - for years BCE, and + for years CE. 	Examples: -0055, +0787, +1999, +10191
    X: (date: Date): string => {
        const year = date.getFullYear();
        const result = addLeadingZeros(year, 4);

        return year < 0 ? result : `+${result}`;
    },

    // An expanded full numeric representation if required, or a standard full numeral representation if possible (like Y). At least four digits. Years BCE are prefixed with a -. Years beyond (and including) 10000 are prefixed by a +. 	Examples: -0055, 0787, 1999, +10191
    x: (date: Date): string => {
        const year = date.getFullYear();
        const result = addLeadingZeros(year, 4);

        return year > 9999 ? `+${result}` : result;
    },

    // A full numeric representation of a year, at least 4 digits, with - for years BCE. 	Examples: -0055, 0787, 1999, 2003, 10191
    Y: (date: Date): string => {
        return addLeadingZeros(date.getFullYear(), 4);
    },

    // A two digit representation of a year 	Examples: 99 or 03
    y: (date: Date): string => {
        return date.getFullYear().toString().slice(-2);
    },

    // --- Time
    // Lowercase Ante meridiem and Post meridiem 	am or pm
    a: (date: Date): string => {
        return date.getHours() >= 12 ? 'pm' : 'am';
    },

    // Uppercase Ante meridiem and Post meridiem 	AM or PM
    A: (date: Date): string => {
        return date.getHours() >= 12 ? 'PM' : 'AM';
    },

    // Swatch Internet time 	000 through 999
    B: (date: Date): string => {
        const totalSeconds = (date.getUTCHours() * 3600) + (date.getUTCMinutes() * 60) + date.getUTCSeconds();
        const swatchBeats = Math.floor((totalSeconds / 86.4) % 1000);
        return swatchBeats.toString().padStart(3, '0');
    },

    // 12-hour format of an hour without leading zeros 	1 through 12
    g: (date: Date): string => {
        const hours = date.getHours() % 12;

        return (hours ? hours : 12).toString();
    },

    // 24-hour format of an hour without leading zeros 	0 through 23
    G: (date: Date): string => {
        return date.getHours().toString();
    },

    // 12-hour format of an hour with leading zeros 	01 through 12
    h: (date: Date): string => {
        const hours = date.getHours() % 12;

        return addLeadingZeros((hours ? hours : 12));
    },

    // 24-hour format of an hour with leading zeros 	00 through 23
    H: (date: Date): string => {
        return addLeadingZeros(date.getHours());
    },

    // Minutes with leading zeros 	00 to 59
    i: (date: Date): string => {
        return addLeadingZeros(date.getMinutes());
    },

    // Seconds with leading zeros 	00 through 59
    s: (date: Date): string => {
        return addLeadingZeros(date.getSeconds());
    },

    // Milliseconds. Same note applies as for u. 	Example: 654
    v: (date: Date): string => {
        return date.getMilliseconds().toString();
    },
}

/**
 *
 * Date format like PHP's `date()` function.
 *
 * > NOTE: `Timezone` and `Time/Date` formats are not supported. Only `Day`, `Week`, `Month`, `Year` and `Time`!
 *
 * > Description from: <a href="https://www.php.net/manual/en/datetime.format.php">https://www.php.net/manual/en/datetime.format.php</a>
 *
 * The following characters are recognized in the
 * format parameter string:
 * <br><br>
 * <table>
 * <tr valign="top" colspan="3" bgcolor="silver">
 * <th>format character</th>
 * <th>Description</th>
 * <th>Example returned values</th>
 * </tr>
 * <tr valign="top">
 * <td><b>Day</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>d</td>
 * <td>Day of the month, 2 digits with leading zeros</td>
 * <td>01 to 31</td>
 * </tr>
 * <tr valign="top">
 * <td>D</td>
 * <td>A textual representation of a day, three letters</td>
 * <td>Mon through Sun</td>
 * </tr>
 * <tr valign="top">
 * <td>j</td>
 * <td>Day of the month without leading zeros</td>
 * <td>1 to 31</td>
 * </tr>
 * <tr valign="top">
 * <td>l (lowercase 'L')</td>
 * <td>A full textual representation of the day of the week</td>
 * <td>Sunday through Saturday</td>
 * </tr>
 * <tr valign="top">
 * <td>N</td>
 * <td>ISO-8601 numeric representation of the day of the week (added in
 * PHP 5.1.0)</td>
 * <td>1 (for Monday) through 7 (for Sunday)</td>
 * </tr>
 * <tr valign="top">
 * <td>S</td>
 * <td>English ordinal suffix for the day of the month, 2 characters</td>
 * <td>
 * st, nd, rd or
 * th. Works well with j
 * </td>
 * </tr>
 * <tr valign="top">
 * <td>w</td>
 * <td>Numeric representation of the day of the week</td>
 * <td>0 (for Sunday) through 6 (for Saturday)</td>
 * </tr>
 * <tr valign="top">
 * <td>z</td>
 * <td>The day of the year (starting from 0)</td>
 * <td>0 through 365</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Week</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>W</td>
 * <td>ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)</td>
 * <td>Example: 42 (the 42nd week in the year)</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Month</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>F</td>
 * <td>A full textual representation of a month, such as January or March</td>
 * <td>January through December</td>
 * </tr>
 * <tr valign="top">
 * <td>m</td>
 * <td>Numeric representation of a month, with leading zeros</td>
 * <td>01 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>M</td>
 * <td>A short textual representation of a month, three letters</td>
 * <td>Jan through Dec</td>
 * </tr>
 * <tr valign="top">
 * <td>n</td>
 * <td>Numeric representation of a month, without leading zeros</td>
 * <td>1 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>t</td>
 * <td>Number of days in the given month</td>
 * <td>28 through 31</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Year</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>L</td>
 * <td>Whether it's a leap year</td>
 * <td>1 if it is a leap year, 0 otherwise.</td>
 * </tr>
 * <tr valign="top">
 * <td>o</td>
 * <td>ISO-8601 year number. This has the same value as
 * Y, except that if the ISO week number
 * (W) belongs to the previous or next year, that year
 * is used instead. (added in PHP 5.1.0)</td>
 * <td>Examples: 1999 or 2003</td>
 * </tr>
 * <tr valign="top">
 * <td>Y</td>
 * <td>A full numeric representation of a year, 4 digits</td>
 * <td>Examples: 1999 or 2003</td>
 * </tr>
 * <tr valign="top">
 * <td>y</td>
 * <td>A two digit representation of a year</td>
 * <td>Examples: 99 or 03</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Time</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>a</td>
 * <td>Lowercase Ante meridiem and Post meridiem</td>
 * <td>am or pm</td>
 * </tr>
 * <tr valign="top">
 * <td>A</td>
 * <td>Uppercase Ante meridiem and Post meridiem</td>
 * <td>AM or PM</td>
 * </tr>
 * <tr valign="top">
 * <td>B</td>
 * <td>Swatch Internet time</td>
 * <td>000 through 999</td>
 * </tr>
 * <tr valign="top">
 * <td>g</td>
 * <td>12-hour format of an hour without leading zeros</td>
 * <td>1 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>G</td>
 * <td>24-hour format of an hour without leading zeros</td>
 * <td>0 through 23</td>
 * </tr>
 * <tr valign="top">
 * <td>h</td>
 * <td>12-hour format of an hour with leading zeros</td>
 * <td>01 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>H</td>
 * <td>24-hour format of an hour with leading zeros</td>
 * <td>00 through 23</td>
 * </tr>
 * <tr valign="top">
 * <td>i</td>
 * <td>Minutes with leading zeros</td>
 * <td>00 to 59</td>
 * </tr>
 * <tr valign="top">
 * <td>s</td>
 * <td>Seconds, with leading zeros</td>
 * <td>00 through 59</td>
 * </tr>
 * <tr valign="top">
 * <td>u</td>
 * <td>Microseconds (added in PHP 5.2.2)</td>
 * <td>Example: 654321</td>
 * </tr>
 * </table>
 *
 * @param format Format string as described above.
 * @param date {Date} Javascript `Date` object.
 */
export function formatDate(format: string, date: Date): string {
    let result = '';

    for (let i = 0; i < format.length; i++) {
        const char = format[i];
        result += char in tokenCallbacks ? tokenCallbacks[char](date) : char;
    }

    return result;
}

/**
 * Date format like PHP's `date()` function.
 *
 * > NOTE: `Timezone` and `Time/Date` formats are not supported. Only `Day`, `Week`, `Month`, `Year` and `Time`!
 *
 * > Description from: <a href="https://www.php.net/manual/en/datetime.format.php">https://www.php.net/manual/en/datetime.format.php</a>
 *
 * The following characters are recognized in the
 * format parameter string:
 * <br><br>
 * <table>
 * <tr valign="top" colspan="3" bgcolor="silver">
 * <th>format character</th>
 * <th>Description</th>
 * <th>Example returned values</th>
 * </tr>
 * <tr valign="top">
 * <td><b>Day</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>d</td>
 * <td>Day of the month, 2 digits with leading zeros</td>
 * <td>01 to 31</td>
 * </tr>
 * <tr valign="top">
 * <td>D</td>
 * <td>A textual representation of a day, three letters</td>
 * <td>Mon through Sun</td>
 * </tr>
 * <tr valign="top">
 * <td>j</td>
 * <td>Day of the month without leading zeros</td>
 * <td>1 to 31</td>
 * </tr>
 * <tr valign="top">
 * <td>l (lowercase 'L')</td>
 * <td>A full textual representation of the day of the week</td>
 * <td>Sunday through Saturday</td>
 * </tr>
 * <tr valign="top">
 * <td>N</td>
 * <td>ISO-8601 numeric representation of the day of the week (added in
 * PHP 5.1.0)</td>
 * <td>1 (for Monday) through 7 (for Sunday)</td>
 * </tr>
 * <tr valign="top">
 * <td>S</td>
 * <td>English ordinal suffix for the day of the month, 2 characters</td>
 * <td>
 * st, nd, rd or
 * th. Works well with j
 * </td>
 * </tr>
 * <tr valign="top">
 * <td>w</td>
 * <td>Numeric representation of the day of the week</td>
 * <td>0 (for Sunday) through 6 (for Saturday)</td>
 * </tr>
 * <tr valign="top">
 * <td>z</td>
 * <td>The day of the year (starting from 0)</td>
 * <td>0 through 365</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Week</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>W</td>
 * <td>ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)</td>
 * <td>Example: 42 (the 42nd week in the year)</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Month</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>F</td>
 * <td>A full textual representation of a month, such as January or March</td>
 * <td>January through December</td>
 * </tr>
 * <tr valign="top">
 * <td>m</td>
 * <td>Numeric representation of a month, with leading zeros</td>
 * <td>01 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>M</td>
 * <td>A short textual representation of a month, three letters</td>
 * <td>Jan through Dec</td>
 * </tr>
 * <tr valign="top">
 * <td>n</td>
 * <td>Numeric representation of a month, without leading zeros</td>
 * <td>1 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>t</td>
 * <td>Number of days in the given month</td>
 * <td>28 through 31</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Year</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>L</td>
 * <td>Whether it's a leap year</td>
 * <td>1 if it is a leap year, 0 otherwise.</td>
 * </tr>
 * <tr valign="top">
 * <td>o</td>
 * <td>ISO-8601 year number. This has the same value as
 * Y, except that if the ISO week number
 * (W) belongs to the previous or next year, that year
 * is used instead. (added in PHP 5.1.0)</td>
 * <td>Examples: 1999 or 2003</td>
 * </tr>
 * <tr valign="top">
 * <td>Y</td>
 * <td>A full numeric representation of a year, 4 digits</td>
 * <td>Examples: 1999 or 2003</td>
 * </tr>
 * <tr valign="top">
 * <td>y</td>
 * <td>A two digit representation of a year</td>
 * <td>Examples: 99 or 03</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Time</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>a</td>
 * <td>Lowercase Ante meridiem and Post meridiem</td>
 * <td>am or pm</td>
 * </tr>
 * <tr valign="top">
 * <td>A</td>
 * <td>Uppercase Ante meridiem and Post meridiem</td>
 * <td>AM or PM</td>
 * </tr>
 * <tr valign="top">
 * <td>B</td>
 * <td>Swatch Internet time</td>
 * <td>000 through 999</td>
 * </tr>
 * <tr valign="top">
 * <td>g</td>
 * <td>12-hour format of an hour without leading zeros</td>
 * <td>1 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>G</td>
 * <td>24-hour format of an hour without leading zeros</td>
 * <td>0 through 23</td>
 * </tr>
 * <tr valign="top">
 * <td>h</td>
 * <td>12-hour format of an hour with leading zeros</td>
 * <td>01 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>H</td>
 * <td>24-hour format of an hour with leading zeros</td>
 * <td>00 through 23</td>
 * </tr>
 * <tr valign="top">
 * <td>i</td>
 * <td>Minutes with leading zeros</td>
 * <td>00 to 59</td>
 * </tr>
 * <tr valign="top">
 * <td>s</td>
 * <td>Seconds, with leading zeros</td>
 * <td>00 through 59</td>
 * </tr>
 * <tr valign="top">
 * <td>u</td>
 * <td>Microseconds (added in PHP 5.2.2)</td>
 * <td>Example: 654321</td>
 * </tr>
 * </table>
 *
 * @param format Format string as described above.
 * @param datetime Datetime string, e.g. `1970-01-01T15:45:30.000000Z`
 */
export function formatDatetime(format: string, datetime: string): string {
    const date = new Date(datetime);
    return formatDate(format, date);
}

/**
 * Date format like PHP's `date()` function.
 *
 * > NOTE: `Timezone` and `Time/Date` formats are not supported. Only `Day`, `Week`, `Month`, `Year` and `Time`!
 *
 * > Description from: <a href="https://www.php.net/manual/en/datetime.format.php">https://www.php.net/manual/en/datetime.format.php</a>
 *
 * The following characters are recognized in the
 * format parameter string:
 * <br><br>
 * <table>
 * <tr valign="top" colspan="3" bgcolor="silver">
 * <th>format character</th>
 * <th>Description</th>
 * <th>Example returned values</th>
 * </tr>
 * <tr valign="top">
 * <td><b>Day</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>d</td>
 * <td>Day of the month, 2 digits with leading zeros</td>
 * <td>01 to 31</td>
 * </tr>
 * <tr valign="top">
 * <td>D</td>
 * <td>A textual representation of a day, three letters</td>
 * <td>Mon through Sun</td>
 * </tr>
 * <tr valign="top">
 * <td>j</td>
 * <td>Day of the month without leading zeros</td>
 * <td>1 to 31</td>
 * </tr>
 * <tr valign="top">
 * <td>l (lowercase 'L')</td>
 * <td>A full textual representation of the day of the week</td>
 * <td>Sunday through Saturday</td>
 * </tr>
 * <tr valign="top">
 * <td>N</td>
 * <td>ISO-8601 numeric representation of the day of the week (added in
 * PHP 5.1.0)</td>
 * <td>1 (for Monday) through 7 (for Sunday)</td>
 * </tr>
 * <tr valign="top">
 * <td>S</td>
 * <td>English ordinal suffix for the day of the month, 2 characters</td>
 * <td>
 * st, nd, rd or
 * th. Works well with j
 * </td>
 * </tr>
 * <tr valign="top">
 * <td>w</td>
 * <td>Numeric representation of the day of the week</td>
 * <td>0 (for Sunday) through 6 (for Saturday)</td>
 * </tr>
 * <tr valign="top">
 * <td>z</td>
 * <td>The day of the year (starting from 0)</td>
 * <td>0 through 365</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Week</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>W</td>
 * <td>ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)</td>
 * <td>Example: 42 (the 42nd week in the year)</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Month</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>F</td>
 * <td>A full textual representation of a month, such as January or March</td>
 * <td>January through December</td>
 * </tr>
 * <tr valign="top">
 * <td>m</td>
 * <td>Numeric representation of a month, with leading zeros</td>
 * <td>01 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>M</td>
 * <td>A short textual representation of a month, three letters</td>
 * <td>Jan through Dec</td>
 * </tr>
 * <tr valign="top">
 * <td>n</td>
 * <td>Numeric representation of a month, without leading zeros</td>
 * <td>1 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>t</td>
 * <td>Number of days in the given month</td>
 * <td>28 through 31</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Year</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>L</td>
 * <td>Whether it's a leap year</td>
 * <td>1 if it is a leap year, 0 otherwise.</td>
 * </tr>
 * <tr valign="top">
 * <td>o</td>
 * <td>ISO-8601 year number. This has the same value as
 * Y, except that if the ISO week number
 * (W) belongs to the previous or next year, that year
 * is used instead. (added in PHP 5.1.0)</td>
 * <td>Examples: 1999 or 2003</td>
 * </tr>
 * <tr valign="top">
 * <td>Y</td>
 * <td>A full numeric representation of a year, 4 digits</td>
 * <td>Examples: 1999 or 2003</td>
 * </tr>
 * <tr valign="top">
 * <td>y</td>
 * <td>A two digit representation of a year</td>
 * <td>Examples: 99 or 03</td>
 * </tr>
 * <tr valign="top">
 * <td><b>Time</b></td>
 * <td>---</td>
 * <td>---</td>
 * </tr>
 * <tr valign="top">
 * <td>a</td>
 * <td>Lowercase Ante meridiem and Post meridiem</td>
 * <td>am or pm</td>
 * </tr>
 * <tr valign="top">
 * <td>A</td>
 * <td>Uppercase Ante meridiem and Post meridiem</td>
 * <td>AM or PM</td>
 * </tr>
 * <tr valign="top">
 * <td>B</td>
 * <td>Swatch Internet time</td>
 * <td>000 through 999</td>
 * </tr>
 * <tr valign="top">
 * <td>g</td>
 * <td>12-hour format of an hour without leading zeros</td>
 * <td>1 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>G</td>
 * <td>24-hour format of an hour without leading zeros</td>
 * <td>0 through 23</td>
 * </tr>
 * <tr valign="top">
 * <td>h</td>
 * <td>12-hour format of an hour with leading zeros</td>
 * <td>01 through 12</td>
 * </tr>
 * <tr valign="top">
 * <td>H</td>
 * <td>24-hour format of an hour with leading zeros</td>
 * <td>00 through 23</td>
 * </tr>
 * <tr valign="top">
 * <td>i</td>
 * <td>Minutes with leading zeros</td>
 * <td>00 to 59</td>
 * </tr>
 * <tr valign="top">
 * <td>s</td>
 * <td>Seconds, with leading zeros</td>
 * <td>00 through 59</td>
 * </tr>
 * <tr valign="top">
 * <td>u</td>
 * <td>Microseconds (added in PHP 5.2.2)</td>
 * <td>Example: 654321</td>
 * </tr>
 * </table>
 *
 * @param format Format string as described above.
 * @param timestamp (Optional) timestamp. Default is `Date.now()` Param `isSecondsTimestamp` has no effect if not set.
 * @param isSecondsTimestamp (Optional) Determines if `timestamp` is in seconds or milliseconds.
 */
export function date(format: string, timestamp?: number, isSecondsTimestamp = true): string {
    const date = timestamp === undefined ? new Date() : (isSecondsTimestamp ? new Date(timestamp * 1000) : new Date(timestamp));
    return formatDate(format, date);
}
