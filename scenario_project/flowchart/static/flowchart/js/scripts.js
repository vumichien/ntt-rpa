function showProcessing() {
  // すべてのセクションをリセット
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

function typeText(text, index, callback, elementId = "typing-text") {
  const typingElement = document.getElementById(elementId);
  if (index < text.length) {
    typingElement.innerHTML = text
      .substring(0, index + 1)
      .replace(/\n/g, "<br>");
    setTimeout(() => {
      typeText(text, index + 1, callback, elementId);
    }, 50);
  } else {
    callback();
  }
}

function generateFlows() {
  const flowchartsSection = document.getElementById("flowcharts-section");
  flowchartsSection.classList.remove("d-none");

  // 選択された操作を取得
  const checkbox1 = document.getElementById("checkbox1").checked;
  const checkbox2 = document.getElementById("checkbox2").checked;
  const checkbox3 = document.getElementById("checkbox3").checked;

  // 選択されたチェックボックスに基づいて説明を生成
  let description = "以下の操作が選択されました：\n";
  if (checkbox1) {
    description += "・システムに新しい入力操作が追加されました。\n";
  }
  if (checkbox2) {
    description += "・データベースから古いデータが削除されました。\n";
  }
  if (checkbox3) {
    description += "・入力ボックスの表示テキストが更新されました。\n";
  }
  if (!checkbox1 && !checkbox2 && !checkbox3) {
    description += "・操作は選択されませんでした。\n";
  }

  // 説明を入力
  const actionDescription = document.getElementById("action-description");
  actionDescription.innerHTML = ""; // 既存のコンテンツをクリア
  typeText(description, 0, () => {}, "action-description");
}

function redirectToChatbot() {
  window.location.href = "/flowchart/chatbot/";
}

function downloadSVG() {
  // SVGを含む要素を取得
  const flowchartContainer = document.getElementById("import-scenario");
  if (!flowchartContainer) {
    alert("SVG要素が見つかりません！");
    return;
  }

  // 要素内の<svg>タグを見つける
  const svgElement = flowchartContainer.querySelector("svg");
  if (!svgElement) {
    alert("指定されたコンテナにSVGが見つかりません！");
    return;
  }

  // SVGデータを準備
  const svgContent = svgElement.outerHTML;
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });

  // ダウンロードリンクを作成
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "import-scenario.svg"; // ダウンロード時のファイル名
  link.click();
}

// すべてのセクションをリセットする新しい関数を追加
function resetAllSections() {
  // すべてのセクションをd-noneにリセット
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

  // タイピングテキストのコンテンツをリセット
  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    typingElement.innerHTML = "";
  }

  // チェックボックスをリセット
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // アクションの説明もリセット
  const actionDescription = document.getElementById("action-description");
  if (actionDescription) {
    actionDescription.innerHTML = "";
  }
}
