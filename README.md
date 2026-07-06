# On Par Entertainment Events Roadmap

Static Vercel site for the 90-day On Par Entertainment marketing events calendar.

## Update Events

The shared live version is driven by:

```text
src/data/events.json
```

Edit that file in GitHub, commit to `main`, and Vercel will redeploy the site.

The page also has an `Edit` button. Changes made there are saved as a browser draft on that device. Use `Export JSON` to download the updated data, then replace `src/data/events.json` with the exported file when you want the public site updated.

## Local Preview

```bash
npx serve .
```

Open the local URL and verify the calendar before pushing changes.
