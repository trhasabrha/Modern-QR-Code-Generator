$(document).ready(function () {
  $("#theme-toggle").click(function () {
    $("body").toggleClass("dark");

    if ($("body").hasClass("dark")) {
      $("#theme-toggle").html("☀️");
    } else {
      $("#theme-toggle").html("🌙");
    }
  });

  $(document).ready(function () {
    if ($("body").hasClass("dark")) {
      $("#theme-toggle").html("☀️");
    } else {
      $("#theme-toggle").html("🌙");
    }
  });

  $(".custom-select").click(function (e) {
    e.stopPropagation();
    $(".custom-select").not(this).find(".options").slideUp(100);
    $(this).find(".options").slideToggle(150);
  });

  $(".custom-select .options li").click(function (e) {
    const value = $(this).data("value");
    const text = $(this).text();
    const wrapper = $(this).closest(".custom-select");
    wrapper.find(".selected").text(text);
    wrapper.find("li").removeClass("active");
    $(this).addClass("active");

    const inputId = wrapper.attr("id") === "type-dropdown" ? "#type" : "#size";
    $(inputId).val(value).trigger("change");
  });

  $(document).click(function () {
    $(".custom-select .options").slideUp(100);
  });

  $("#generate").click(function () {
    const type = $("#type").val();
    const size = parseInt($("#size").val());
    const includeLogo = $("#include-logo").is(":checked");

    let text = "";
    if (type === "text") {
      text = $("#text").val().trim();
    } else if (type === "wifi") {
      const ssid = $("#ssid").val().trim();
      const password = $("#password").val().trim();
      const encryption = $("#encryption").val().trim();
      text = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    } else if (type === "vcard") {
      const name = $("#name").val().trim();
      const phone = $("#phone").val().trim();
      const email = $("#email").val().trim();
      text = `BEGIN:VCARD\\nVERSION:3.0\\nN:${name}\\nTEL:${phone}\\nEMAIL:${email}\\nEND:VCARD`;
    }

    if (!text) {
      alert("Please fill out the required fields.");
      return;
    }

    $("#output").html(
      '<div id="qr-box"></div><button id="download" style="display:none;">Download QR-Code ⬇️</button>'
    );

    const qr = new QRCode(document.getElementById("qr-box"), {
      text: text,
      width: size,
      height: size,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    setTimeout(() => {
      const canvas = $("#output canvas")[0];
      if (includeLogo && canvas) {
        const ctx = canvas.getContext("2d");
        const logo = new Image();
        logo.src = "logo.png";
        logo.onload = () => {
          const w = canvas.width / 4;
          const x = (canvas.width - w) / 2;
          ctx.drawImage(logo, x, x, w, w);
          $("#download").show();
        };
      } else {
        $("#download").show();
      }
    }, 500);
  });

  $("#output").on("click", "#download", function () {
    const canvas = $("#output canvas")[0];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  $("#type").on("change", function () {
    const type = $(this).val();
    $(".input-type").hide();
    if (type === "text") $("#input-text").show();
    if (type === "wifi") $("#input-wifi").show();
    if (type === "vcard") $("#input-vcard").show();
  });

  $("#type").trigger("change");
});
