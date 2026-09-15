/**
 * MAKTAB CRM - CHARTS & ANALYTICS CONTROLLER
 * Chart.js yordamida interaktiv tahliliy grafiklar
 */

const CRM_Charts = {
  attendanceChart: null,
  financeChart: null,
  distributionChart: null,

  init() {
    this.renderAttendanceChart();
    this.renderDistributionChart();
  },

  renderAttendanceChart() {
    const ctx = document.getElementById('attendance-chart');
    if (!ctx) return;

    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    this.attendanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'],
        datasets: [{
          label: 'Haftalik Davomat (%)',
          data: [96.5, 98.2, 94.8, 97.4, 95.9, 93.0],
          borderColor: '#6366f1',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#38bdf8',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Davomat: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Plus Jakarta Sans', size: 12 }
            }
          },
          y: {
            min: 85,
            max: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Plus Jakarta Sans', size: 12 },
              callback: function(val) {
                return val + '%';
              }
            }
          }
        }
      }
    });
  },

  renderDistributionChart() {
    const ctx = document.getElementById('distribution-chart');
    if (!ctx) return;

    if (this.distributionChart) {
      this.distributionChart.destroy();
    }

    this.distributionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Aniq Fanlar (IT)', 'Tabiiy Fanlar', 'Ijtimoiy', 'Tillar'],
        datasets: [{
          data: [42, 26, 18, 14],
          backgroundColor: [
            '#6366f1',
            '#06b6d4',
            '#10b981',
            '#f59e0b'
          ],
          borderColor: '#0b1120',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { family: 'Plus Jakarta Sans', size: 11 },
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#38bdf8',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      }
    });
  }
};
