/* ---------------------------------------------------------------------------
   OREL IT — GISEC Global 2026 Landing Page
   Plain vanilla JS. No build step, no dependencies.
--------------------------------------------------------------------------- */

// -----------------------------------------------------------------------
// 1. CONFIG / PLACEHOLDERS — replace before publishing
// -----------------------------------------------------------------------
var BROCHURE_PDF_URL = "assets/orel-it-cyber-security-brochure.pdf"; // TODO(replace): final brochure PDF, place it in /assets
var FORM_ENDPOINT = "https://REPLACE_WITH_FORM_ENDPOINT.example.com/api/gisec-leads"; // TODO(replace): CRM/lead endpoint
var CONTACT_EMAIL = "info@orel-it.com"; // TODO(replace): confirm contact email

// Wire the brochure download links/buttons to the real PDF URL above.
document.querySelectorAll("[data-brochure-link]").forEach(function (el) {
  el.setAttribute("href", BROCHURE_PDF_URL);
});

// Footer copyright year
var yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -----------------------------------------------------------------------
// 2. ANALYTICS — replace trackEvent's body with your analytics call
//    (GTM dataLayer.push, gtag, Segment analytics.track, etc.)
// -----------------------------------------------------------------------
function trackEvent(eventName, payload) {
  // TODO(replace): wire to real analytics, e.g.:
  // window.dataLayer && window.dataLayer.push({ event: eventName, ...payload });
  // eslint-disable-next-line no-console
  console.log("[analytics]", eventName, payload || {});
}

// Fire tracked events for every element carrying data-track, without
// blocking the underlying navigation / download.
document.querySelectorAll("[data-track]").forEach(function (el) {
  el.addEventListener("click", function () {
    trackEvent(el.getAttribute("data-track"));
  });
});

// -----------------------------------------------------------------------
// 3. UTM CAPTURE — populate hidden form fields from the landing URL
// -----------------------------------------------------------------------
(function captureUtm() {
  var params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (key) {
    var field = document.getElementById(key);
    if (field) field.value = params.get(key) || "";
  });
})();

// -----------------------------------------------------------------------
// 4. LEAD FORM — validation, loading, error, success states
// -----------------------------------------------------------------------
(function leadForm() {
  var form = document.getElementById("lead-form");
  if (!form) return;

  var submitBtn = document.getElementById("submit-btn");
  var submitLabel = document.getElementById("submit-label");
  var submitArrow = document.getElementById("submit-arrow");
  var submitSpinner = document.getElementById("submit-spinner");
  var formError = document.getElementById("form-error");
  var formSuccess = document.getElementById("form-success");
  var consentError = document.getElementById("consent-error");

  var requiredFields = [
    "fullName",
    "workEmail",
    "company",
    "jobTitle",
    "country",
    "areaOfInterest",
    "eventDate",
    "preferredTime",
  ];

  var startedTracking = false;
  form.addEventListener(
    "focusin",
    function () {
      if (!startedTracking) {
        startedTracking = true;
        trackEvent("form_start");
      }
    },
    true
  );

  function clearFieldError(name) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (!wrap) return;
    wrap.classList.remove("has-error");
    var err = wrap.querySelector(".field-error");
    if (err) err.remove();
  }

  function setFieldError(name, message) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (!wrap) return;
    wrap.classList.add("has-error");
    if (wrap.querySelector(".field-error")) return;
    var err = document.createElement("p");
    err.className = "field-error";
    err.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span></span>';
    err.querySelector("span").textContent = message;
    wrap.appendChild(err);
  }

  requiredFields.forEach(function (name) {
    var el = form.elements[name];
    if (el) {
      el.addEventListener("input", function () {
        clearFieldError(name);
      });
    }
  });

  var consentInput = document.getElementById("consent");
  consentInput.addEventListener("change", function () {
    if (consentInput.checked) consentError.classList.add("hidden");
  });

  function validate() {
    var isValid = true;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    requiredFields.forEach(function (name) {
      clearFieldError(name);
      var value = form.elements[name].value.trim();
      if (!value) {
        setFieldError(name, "This field is required.");
        isValid = false;
      } else if (name === "workEmail" && !emailRegex.test(value)) {
        setFieldError(name, "Enter a valid email address.");
        isValid = false;
      }
    });

    if (!consentInput.checked) {
      consentError.classList.remove("hidden");
      isValid = false;
    } else {
      consentError.classList.add("hidden");
    }

    return isValid;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitLabel.textContent = isLoading ? "Sending\u2026" : "Request My Session";
    submitArrow.classList.toggle("hidden", isLoading);
    submitSpinner.classList.toggle("hidden", !isLoading);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formError.classList.add("hidden");

    if (!validate()) return;

    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = value;
    });
    data.source = "GISEC Global 2026 Landing Page";

    setLoading(true);
    trackEvent("form_submit", { areaOfInterest: data.areaOfInterest, eventDate: data.eventDate });

    // TODO(replace): FORM_ENDPOINT must point to a real CRM / lead-capture API.
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Request failed");
        setLoading(false);
        form.classList.add("hidden");
        formSuccess.classList.remove("hidden");
        trackEvent("form_success");
      })
      .catch(function (err) {
        setLoading(false);
        formError.classList.remove("hidden");
        trackEvent("form_error", { message: err && err.message });
      });
  });
})();
