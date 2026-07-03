(function () {
  "use strict";

  const targetDate = new Date(2026, 6, 27, 0, 0, 0);
  const units = [
    { key: "days", digits: 3 },
    { key: "hours", digits: 2 },
    { key: "minutes", digits: 2 },
    { key: "seconds", digits: 2 }
  ];

  const state = new Map();
  const statusMessage = document.getElementById("status-message");
  let timer = 0;

  function pad(value, digits) {
    return String(value).padStart(digits, "0");
  }

  function setUnit(key, value) {
    const unit = units.find((item) => item.key === key);
    const element = document.getElementById(key);
    const flap = document.querySelector(`.flap[data-unit="${key}"]`);

    if (!unit || !element || !flap) {
      return;
    }

    const nextValue = pad(value, unit.digits);
    if (state.get(key) === nextValue) {
      return;
    }

    element.textContent = nextValue;
    state.set(key, nextValue);

    flap.classList.remove("is-changing");
    void flap.offsetWidth;
    flap.classList.add("is-changing");
  }

  function getRemainingTime() {
    const difference = Math.max(0, targetDate.getTime() - Date.now());
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, difference };
  }

  function updateCountdown() {
    const remaining = getRemainingTime();

    setUnit("days", remaining.days);
    setUnit("hours", remaining.hours);
    setUnit("minutes", remaining.minutes);
    setUnit("seconds", remaining.seconds);

    if (remaining.difference <= 0 && statusMessage) {
      statusMessage.textContent = "The EXSSA USA Silver Jubilee celebration is here.";
      window.clearInterval(timer);
    }
  }

  function loadLogo() {
    const logo = document.getElementById("event-logo");
    if (!logo) {
      return;
    }

    const candidates = [
      "logo/exssa-usa-silver-jubilee-logo.jpeg",
      "logo/exssa-usa-silver-jubilee-logo.jpg",
      "logo/logo.jpeg",
      "logo/logo.jpg",
      "logo/logo.png",
      "logo/image.png"
    ];

    let index = 0;

    function tryNextLogo() {
      if (index >= candidates.length) {
        logo.closest(".logo-wrap")?.remove();
        return;
      }

      logo.src = candidates[index];
      index += 1;
    }

    logo.addEventListener("error", tryNextLogo);
    tryNextLogo();
  }

  loadLogo();
  updateCountdown();

  timer = window.setInterval(updateCountdown, 1000);
})();
