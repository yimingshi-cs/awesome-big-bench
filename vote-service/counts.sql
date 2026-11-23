-- Aggregate export for the maintainer. Never export edit handles.
SELECT campaign, edition,
       SUM(CASE WHEN choice = 'up' THEN 1 ELSE 0 END) AS up,
       SUM(CASE WHEN choice = 'down' THEN 1 ELSE 0 END) AS down
FROM ballots
GROUP BY campaign, edition
ORDER BY campaign, edition;
