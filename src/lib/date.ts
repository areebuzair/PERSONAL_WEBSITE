function formatTimeAgo(date: string) {
    const date_formatter = new Intl.RelativeTimeFormat("en-uk", {
        numeric: "auto",
    })

    const today = new Date();
    const DIVISIONS = [
        { amount: 60, name: "seconds" },
        { amount: 60, name: "minutes" },
        { amount: 24, name: "hours" },
        { amount: 7, name: "days" },
        { amount: 4.34524, name: "weeks" },
        { amount: 12, name: "months" },
        { amount: Number.POSITIVE_INFINITY, name: "years" },
    ]
    let duration = (new Date(date) - today) / 1000

    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i]
        if (Math.abs(duration) < division.amount) {
            return date_formatter.format(Math.round(duration), division.name)
        }
        duration /= division.amount
    }
}