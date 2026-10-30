// Option lists and patterns for the /free-report form. Shared by the form
// (client) and the notification route (server) so both validate the same way.
// Nothing private belongs in this file — it ships in the browser bundle.

export const industries = ["Professional Services", "Construction", "Healthcare", "Real Estate", "Finance", "E-commerce", "Manufacturing", "Technology", "Hospitality", "Education", "Other"];
export const services = ["Complete Website QA", "Website Redesign", "Performance / UX Review", "Other"];
export const checks = ["Full Website QA", "UI/UX Review", "Mobile Responsiveness", "Design & Layout", "Functionality", "Conversion Review", "Not Sure — Review Everything", "Other"];

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_PATTERN = "(https?://)?([\\w-]+\\.)+[a-zA-Z]{2,}(/\\S*)?";
export const URL_TEST = new RegExp(`^${URL_PATTERN}$`);
