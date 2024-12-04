function showProcessing() {
  // Reset all sections first
  resetAllSections();

  const processingSection = document.getElementById("processing");
  const summarySection = document.getElementById("summary-section");
  const hintSection = document.getElementById("hint-section");
  const flowchartsSection = document.getElementById("flowcharts-section");

  processingSection.classList.remove("d-none");

  setTimeout(() => {
    processingSection.classList.add("d-none");
    summarySection.classList.remove("d-none");

    const loginScenario =
      "ログインシナリオでは、システムを起動し、IDを入力してからログインボタンをクリックする一連の操作を行います。";
    const importScenario =
      "インポートシナリオでは、システム起動後、IDとパスワードを入力し、その後ログインボタンをクリックして処理を完了します。";
    const fullText = loginScenario + "\n\n" + importScenario;

    typeText(fullText, 0, () => {
      setTimeout(() => {
        hintSection.classList.remove("d-none");
      }, 1000);
    });
  }, 2000);
}

function typeText(text, index, callback) {
  const typingElement = document.getElementById("typing-text");
  if (index < text.length) {
    typingElement.innerHTML = text
      .substring(0, index + 1)
      .replace(/\n/g, "<br>");
    setTimeout(() => {
      typeText(text, index + 1, callback);
    }, 50); // Tốc độ hiển thị từng ký tự
  } else {
    callback();
  }
}

function generateFlows() {
  const flowchartsSection = document.getElementById("flowcharts-section");

  // Hiển thị flowchart
  flowchartsSection.classList.remove("d-none");
}

function redirectToChatbot() {
  window.location.href = "/flowchart/chatbot/";
}

function downloadSVG() {
  // Lấy phần tử chứa SVG
  const flowchartContainer = document.getElementById("import-scenario");
  if (!flowchartContainer) {
    alert("SVG element not found!");
    return;
  }

  // Tìm thẻ <svg> bên trong phần tử
  const svgElement = flowchartContainer.querySelector("svg");
  if (!svgElement) {
    alert("No SVG found in the specified container!");
    return;
  }

  // Chuẩn bị dữ liệu SVG
  const svgContent = svgElement.outerHTML;
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });

  // Tạo link để tải xuống
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "import-scenario.svg"; // Tên file khi tải xuống
  link.click();
}

// Add new function to reset all sections
function resetAllSections() {
  // Reset all sections to d-none
  const sections = [
    "processing",
    "summary-section",
    "hint-section",
    "flowcharts-section",
  ];

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add("d-none");
    }
  });

  // Reset typing text content
  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    typingElement.innerHTML = "";
  }

  // Reset checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}
