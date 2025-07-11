
// Requires Chart.js and assumes auth-check.js already ran

function renderLoginChart(containerId) {
  const db = firebase.firestore();
  const chartRef = document.getElementById(containerId).getContext('2d');

  // Aggregate login events from last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  db.collection("analytics")
    .where("eventType", "==", "login")
    .where("timestamp", ">=", cutoff)
    .orderBy("timestamp", "asc")
    .get()
    .then(snapshot => {
      const dayCounts = {};

      snapshot.forEach(doc => {
        const date = doc.data().timestamp.toDate().toISOString().substring(0, 10);
        dayCounts[date] = (dayCounts[date] || 0) + 1;
      });

      const labels = Object.keys(dayCounts);
      const values = Object.values(dayCounts);

      new Chart(chartRef, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Logins Per Day',
            data: values,
            backgroundColor: 'rgba(0, 119, 153, 0.6)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Logins Over Past 7 Days' }
          }
        }
      });
    });
}
