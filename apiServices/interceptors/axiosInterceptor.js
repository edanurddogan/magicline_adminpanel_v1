function interceptorsMessage(response) {
  try {
    if (response.status === 401) {
      //response.data "Email or Password" yazısını içeriyorsa kontrolünü yapmak için if ekle

      if (response.data.includes("Email or Password")) {
        Notify.create({
          type: "negative",
          message: i18n.global.t("apierror"),
          caption: error.response.data.error?.errors
            ? error.response.data.error?.errors[0]
            : error.response?.statusText ?? error.message,
        });
      }
    }
  } catch (error) {}
}

export default interceptorsMessage;
