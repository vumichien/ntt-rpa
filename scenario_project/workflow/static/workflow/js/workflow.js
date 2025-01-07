document.addEventListener("DOMContentLoaded", function () {
  // Auto expand textarea
  document.querySelectorAll(".auto-expand").forEach((textarea) => {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

    // Khởi tạo chiều cao ban đầu
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  // Function to initialize file upload functionality
  function initializeFileUpload(addBtnId, containerId) {
    const addFileBtn = document.getElementById(addBtnId);
    const fileContainer = document.getElementById(containerId);

    if (addFileBtn && fileContainer) {
      addFileBtn.addEventListener("click", function () {
        const newFileInput = document.createElement("div");
        newFileInput.className = "mb-3 file-input-group";
        newFileInput.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <div class="position-relative flex-grow-1">
              <input type="file" class="form-control pe-5">
              <span class="position-absolute top-50 end-0 translate-middle-y me-2">
                <img src="/static/flowchart/images/upload-icon.png" alt="Upload" class="img-fluid" style="width: 24px; height: 24px; cursor: pointer;">
              </span>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-file">
              <i class="bi bi-trash"></i> 削除
            </button>
          </div>
        `;
        fileContainer.appendChild(newFileInput);

        // Show all remove buttons when there's more than one file input
        const removeButtons = fileContainer.querySelectorAll(".remove-file");
        removeButtons.forEach((btn) => (btn.style.display = "block"));
      });

      // Handle remove button clicks using event delegation
      fileContainer.addEventListener("click", function (e) {
        if (e.target.closest(".remove-file")) {
          const fileInputGroup = e.target.closest(".file-input-group");
          fileInputGroup.remove();

          // Hide remove button if only one file input remains
          const removeButtons = fileContainer.querySelectorAll(".remove-file");
          if (removeButtons.length === 1) {
            removeButtons[0].style.display = "none";
          }
        }
      });
    }
  }

  // Initialize file upload for all containers
  initializeFileUpload("add-file-btn", "file-upload-container"); // For card 1
  initializeFileUpload(
    "add-file-btn-scenario",
    "file-upload-container-scenario"
  ); // For card 2 scenario
  initializeFileUpload("add-file-btn-update", "file-upload-container-update"); // For card 2 update info
  initializeFileUpload("add-file-btn-card3", "file-upload-container-card3"); // For card 3
});

function typeText(text, index, callback, elementId = "typing-text") {
  const typingElement = document.getElementById(elementId);
  if (index < text.length) {
    // Xử lý đặc biệt cho các dòng bắt đầu bằng "-"
    let currentText = text.substring(0, index + 1);
    currentText = currentText.replace(/^-(.+)$/gm, "<strong>• $1</strong>");
    currentText = currentText.replace(/\n/g, "<br>");

    typingElement.innerHTML =
      currentText + '<span class="typing-cursor"></span>';

    setTimeout(() => {
      typeText(text, index + 1, callback, elementId);
    }, 25);
  } else {
    typingElement.innerHTML = text
      .replace(/^-(.+)$/gm, "<strong>• $1</strong>")
      .replace(/\n/g, "<br>");
    callback();
  }
}

function showCard(cardNumber) {
  // Ẩn tất cả các section
  document.getElementById("card1-section").classList.add("d-none");
  document.getElementById("card2-section").classList.add("d-none");
  document.getElementById("card3-section").classList.add("d-none");
  document.getElementById("processing").classList.add("d-none");
  document.getElementById("summary-section").classList.add("d-none");
  document.getElementById("flow-section").classList.add("d-none");
  document.getElementById("menu-buttons").classList.add("d-none");
  document.getElementById("flow-explanation").classList.add("d-none");
  document.getElementById("sample-image-section").classList.add("d-none");

  // Xóa trạng thái active của tất cả các card
  const cards = document.querySelectorAll("#card-section .card");
  cards.forEach((card) => card.classList.remove("active"));

  // Thêm trạng thái active cho card được chọn
  const selectedCard = document.querySelector(
    `#card-section .col-md-4:nth-child(${cardNumber}) .card`
  );
  if (selectedCard) {
    selectedCard.classList.add("active");
  }

  // Hiển thị section tương ứng
  if (cardNumber === 1) {
    document.getElementById("card1-section").classList.remove("d-none");
  } else if (cardNumber === 2) {
    document.getElementById("card2-section").classList.remove("d-none");
  } else if (cardNumber === 3) {
    document.getElementById("card3-section").classList.remove("d-none");
  }
}

function showStepsSequentially(stepIndex = 0) {
    const explanations = [
        "出張前に従業員が仮払申請書を提出する\n従業員は仮払申請書を提出し、旅費の仮払いを申請します。仮払申請書には、出張の日程や移動ルート、交通手段などから計算した概算費用の金額を記載します。",
        "経理部が必要費用を確認する\n経理部は申請内容を確認し、必要費用が妥当かどうか、申請書に漏れがないかをチェックします。",
        "従業員に仮払分の金額を渡す\n経理部は申請された金額を従業員に支払います。従業員の受領印などで、仮払いを確認します。",
        "出張後に仮払経費精算書を提出する\n出張から戻った従業員は、実際にかかった費用の領収書を基に、仮払経費精算書を作成します。",
        "仮払いした額と実費との差額を精算する\n経理部は仮払経費精算書を確認し、余剰や不足を精算します。"
    ];

    const menuButtons = document.getElementById("menu-buttons");
    const button = document.createElement("button");

    if (stepIndex < explanations.length) {
        // Tạo nút menu tương ứng với step hiện tại
        button.className = "btn btn-outline-primary w-100 mb-2";
        button.textContent = `${stepIndex + 1}. ${explanations[stepIndex].split('\n')[0]}`;
        button.addEventListener("click", () => {
            // Khi click nút, hiển thị nội dung tương ứng trong flow-explanation
            const flowExplanation = document.getElementById("flow-explanation-text");
            flowExplanation.innerHTML = ""; // Reset nội dung cũ
            typeText(explanations[stepIndex], 0, () => {}, "flow-explanation-text");
        });
        menuButtons.appendChild(button);

        // Hiển thị nội dung trong flow-explanation
        typeText(explanations[stepIndex], 0, () => {
            // Sau khi nội dung hoàn tất, gọi lại showStepsSequentially cho step tiếp theo
            showStepsSequentially(stepIndex + 1);
        }, "flow-explanation-text");
    }
}



function createScenario(cardNumber) {
  const processingElement = document.getElementById("processing");
  const summarySection = document.getElementById("summary-section");
  const flowSection = document.getElementById("flow-section");
  const flowExplanation = document.getElementById("flow-explanation");
  const summaryTitle = document.getElementById("summary-title");
  const sampleImageSection = document.getElementById("sample-image-section");
  const menuButtons = document.getElementById("menu-buttons");
  menuButtons.innerHTML = ""; // Xóa menu cũ (nếu có)
  if (cardNumber === 3) {
    summaryTitle.textContent = "マニュアル";
  } else {
    summaryTitle.textContent = "まとめ";
  }
  // Ẩn các section khác với hiệu ứng fade
  [
    summarySection,
    flowSection,
    flowExplanation,
    sampleImageSection,
  ].forEach((section) => {
    if (!section.classList.contains("d-none")) {
      section.classList.add("fade-out");
      setTimeout(() => {
        section.classList.add("d-none");
        section.classList.remove("fade-out");
      }, 500);
    }
  });

  // Hiện processing
  processingElement.classList.remove("d-none");
  processingElement.classList.add("fade-in");

  setTimeout(() => {
    processingElement.classList.add("fade-out");
    setTimeout(() => {
      processingElement.classList.add("d-none");
      processingElement.classList.remove("fade-out");

      // Hiện summary section với hiệu ứng fade
      summarySection.classList.remove("d-none");
      summarySection.classList.add("fade-in");

      let summaryText = "";
      let svgContent = "";
      let explanationText = "";

      if (cardNumber === 1) {
        summaryText = `この画面は、<strong>旅費精算申請</strong>を行うためのフォームです。申請者情報、出張期間、目的地、目的、旅費明細などの情報を入力することで、上司に申請を提出できます。
主な構成は以下の通りです：

<strong>申請者情報:</strong> 申請者および承認者の情報を入力します。
<strong>出張情報:</strong> 出張期間、目的地、目的、日当額を設定します。
<strong>旅費明細:</strong> 出張中の交通手段や詳細な費用を入力します。`;

        // Tạo SVG flow đơn giản (theo chiều dọc, màu cam #f7b066)
        svgContent = createFlowSVG(
          ["申請者情報の入力", "出張情報の入力", "旅費明細の入力"],
          "#f7b066"
        );

        explanationText = `
<div class="table-responsive">
  <table class="table table-hover">
    <thead class="table-light">
      <tr>
        <th scope="col">項目</th>
        <th scope="col">説明</th>
        <th scope="col">例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="3" class="table-primary"><strong>1. 申請者情報の入力</strong></td>
      </tr>
      <tr>
        <td>申請者（左側の入力欄）</td>
        <td>🔍アイコンをクリックして申請者名を検索または直接入力します。</td>
        <td>「washino」</td>
      </tr>
      <tr>
        <td>上長（右側の入力欄）</td>
        <td>🔍アイコンをクリックして承認者（上司）の名前を検索または直接入力します。</td>
        <td>「hiyoko」</td>
      </tr>
      <tr>
        <td>No（右上の入力欄）</td>
        <td>自動生成または64文字以内で番号を入力します。</td>
        <td>「1」</td>
      </tr>

      <tr>
        <td colspan="3" class="table-primary"><strong>2. 出張情報の入力</strong></td>
      </tr>
      <tr>
        <td>期間（出発 - 帰着）</td>
        <td>出発日と帰着日をカレンダーから選択します。</td>
        <td>出発日「2021-03-01」<br>帰着日「2021-03-31」</td>
      </tr>
      <tr>
        <td>地域</td>
        <td>ドロップダウンリストから出張の地域を選択します。</td>
        <td>「海外」</td>
      </tr>
      <tr>
        <td>日当</td>
        <td>出張の日当額を入力します。</td>
        <td>「10000」</td>
      </tr>
      <tr>
        <td>行き先</td>
        <td>出張先の都市や国を入力します。</td>
        <td>「サンフランシスコ」</td>
      </tr>
      <tr>
        <td>目的</td>
        <td>出張の目的を入力します。</td>
        <td>「営業面談」</td>
      </tr>

      <tr>
        <td colspan="3" class="table-primary"><strong>3. 旅費明細の入力</strong></td>
      </tr>
      <tr>
        <td>日付</td>
        <td>各旅費の発生日時を入力します。</td>
        <td>「2021-04-21」</td>
      </tr>
      <tr>
        <td>手段</td>
        <td>使用した交通手段をドロップダウンリストから選択します。</td>
        <td>「電車」</td>
      </tr>
      <tr>
        <td>摘要</td>
        <td>旅費の内容や利用区間を具体的に入力します。</td>
        <td>「栄駅〜名古屋駅」</td>
      </tr>
      <tr>
        <td>金額</td>
        <td>旅費の金額（円）を入力します。</td>
        <td>「210」</td>
      </tr>
      <tr>
        <td>領収書</td>
        <td>領収書の有無にチェックを入れます。</td>
        <td>「✔あり」</td>
      </tr>
      <tr>
        <td>+/-ボタン</td>
        <td>「+」ボタンで新しい旅費項目を追加、「-」ボタンで不要な項目を削除できます。</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>
</div>`;
      } else if (cardNumber === 2) {
        summaryText = `変更内容の要約:
-追加: 「バーコードスキャン」と「温度・湿度チェック」ステップを導入。
-削除: 「保管場所の決定」をシステムによる自動化に変更。
-変更: 「入庫記録の入力」をバーコードスキャンによる自動入力へ改善。

主な改善点：
• 作業効率の向上：バーコードスキャンによる自動入力で作業時間を短縮
• ヒューマンエラーの削減：手動入力を減らし、入力ミスを防止
• 品質管理の強化：温度・湿度チェックの導入で保管品質を向上`;

        svgContent = createFlowSVG(
          [
            "納品書の確認",
            "バーコードスキャン",
            "商品の検品",
            "温度・湿度チェック（必要に応じて)",
            "作業記録の保存",
          ],
          "#f7b066",
          [1, 3]
        );

        explanationText = `
<div class="table-responsive">
    <table class="table table-hover">
        <thead class="table-light">
            <tr>
                <th scope="col">ステップ</th>
                <th scope="col">変更内容</th>
                <th scope="col">改善効果</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="3" class="table-primary"><strong>1. 納品書の確認</strong></td>
            </tr>
            <tr>
                <td>変更なし</td>
                <td>従来通りの納品書確認プロセス</td>
                <td>正確な入荷確認の維持</td>
            </tr>

            <tr>
                <td colspan="3" class="table-success"><strong>2. バーコードスキャン（新規追加）</strong></td>
            </tr>
            <tr>
                <td>新機能</td>
                <td>• 商品のバーコードをスキャン<br>• 自動でデータベースに登録</td>
                <td>• 入力時間の短縮（約70%削減）<br>• 入力ミスの防止<br>• トレーサビリティの向上</td>
            </tr>

            <tr>
                <td colspan="3" class="table-primary"><strong>3. 商品の検品</strong></td>
            </tr>
            <tr>
                <td>一部変更</td>
                <td>• タブレットでの検品作業<br>• リアルタイムでの数量確認</td>
                <td>• ペーパーレス化<br>• 即時の在庫反映</td>
            </tr>

            <tr>
                <td colspan="3" class="table-success"><strong>4. 温度・湿度チェック（新規追加）</strong></td>
            </tr>
            <tr>
                <td>新機能</td>
                <td>• IoTセンサーによる自動計測<br>• 異常値の自動アラート</td>
                <td>• 品質管理の強化<br>• 保管環境の最適化<br>• 商品劣化の防止</td>
            </tr>

            <tr>
                <td colspan="3" class="table-primary"><strong>5. 作業記録の保存</strong></td>
            </tr>
            <tr>
                <td>自動化</td>
                <td>• 作業内容の自動記録<br>• クラウドでのデータ保存</td>
                <td>• 作業履歴の完全保存<br>• データ分析の容易化</td>
            </tr>
        </tbody>
    </table>
</div>`;
      } else if (cardNumber === 3) {
        summaryText = `<strong>旅費精算</strong>を行うには、出張する従業員に前もって概算で旅費を渡しておく<strong>「事前仮払い精算」</strong>と、いったん従業員が全額を立て替えてから後日精算する<strong>「事後精算」</strong>の、大きく2つの方法があります。
                
                <strong>事前仮払精算</strong>
                仮払いは、出張にかかる費用を概算で見積もり、あらかじめ従業員に渡しておく方法です。

仮払いで旅費精算を行う流れは、下記のとおりです。`;

        const flowSteps = [
          "1.出張前に従業員が仮払申請書を提出する",
          "2.経理部が必要費用を確認する",
          "3.従業員に仮払分の金額を渡す",
          "4.出張後に従業員が仮払経費精算書を提出する",
          "5.仮払いした金額と実費との差額を精算する",
        ];

        svgContent = createFlowSVG(flowSteps, "#f7b066");

        // Add explanation text to the summary section
        explanationText = `-1. 出張前に従業員が仮払申請書を提出する
張する従業員は仮払申請書を提出し、旅費の仮払いを申請します。仮払申請書には、出張の日程や移動ルート、交通手段などから計算した概算費用の金額を記載します。仮払申請書は申請者の上司に提出され、容について承認を受けます。

-2. 経理部が必要費用を確認する
司の確認後、問題がなければ、経理担当者に仮払申請書が提出されます。経理担当者は申請内容を確認し、必要費用が妥当かどうか、申請書に漏れがないかなどをチェックします。

-3. 従業員に仮払分の金額を渡す
理担当者の確認後、問題がなければ、申請された金額を従業員に支払います。このとき、従業員の受領印などで、仮払いしたことがわかるようにしておきましょう。

-4. 出張後に従業員が仮払経費精算書を提出する
張から戻った従業員は、実際にかかった費用の領収書などをもとに、仮払経費精算書を作成します。仮払経費精算書は、仮払いされた現金が、実際に何にいくら使われたのかを申告するための書類です。

-5. 仮払いした額と実費との差額を精算する
業員が作成した仮払経費精算書は、上司の承認を経て、領収書などとともに経理部に提出されます。経理担当者は内容を確認し、仮払金に余剰や不足があった場合は返金や追加支払いを行います。`;


      }
      if (summaryText) {
        typeText(summaryText, 0, () => {
          // Sau khi summaryText hoàn thành, hiện flowSection
          if (svgContent) {
            flowSection.classList.remove("d-none");
            flowSection.classList.add("fade-in");
            const flowContainer = document.getElementById("flow-container");
            flowContainer.innerHTML = svgContent;

            // Sau khi flowSection hiện, hiện explanationText
            if (explanationText) {
              setTimeout(() => {
                flowExplanation.classList.remove("d-none");
                flowExplanation.classList.add("fade-in");

                // Nếu là cardNumber 1 hoặc 2
                if (cardNumber === 1 || cardNumber === 2) {
                  document.getElementById("flow-explanation-text").innerHTML =
                    explanationText;

                  // Chỉ hiện sample image section cho cardNumber === 1
                  if (cardNumber === 1) {
                    const sampleImageSection = document.getElementById(
                      "sample-image-section"
                    );
                    setTimeout(() => {
                      sampleImageSection.classList.remove("d-none");
                      sampleImageSection.classList.add("fade-in");

                      // Sau khi hiện ảnh xong, mới hiện explanation
                      setTimeout(() => {
                        flowExplanation.classList.remove("d-none");
                        flowExplanation.classList.add("fade-in");
                      }, 500);
                    }, 500);
                  }
                } else {
                  // Các cardNumber khác vẫn giữ nguyên hiệu ứng typing
                  document.getElementById("menu-buttons").classList.remove("d-none");
                  typeText("手順の詳細は以下の通りです。", 0, () => {
                      showStepsSequentially();
                  }, "flow-explanation-text");
                  typeText(
                    explanationText,
                    0,
                    () => {

                    },
                    "flow-explanation-text"
                  );
                }
              }, 500);
            }
          }
        });
      }
    }, 500);
  }, 2000);
}

function createFlowSVG(steps, color, greenIndices = []) {
  const measureText = (text) => {
    const temp = document.createElement("span");
    temp.style.visibility = "hidden";
    temp.style.fontSize = "14px";
    temp.style.position = "absolute";
    temp.innerHTML = text;
    document.body.appendChild(temp);
    const width = temp.offsetWidth;
    document.body.removeChild(temp);
    return width;
  };

  // Tính toán chiều rộng cần thiết cho mỗi box
  let maxWidth = 120;
  steps.forEach((step) => {
    const textWidth = measureText(step);
    maxWidth = Math.max(maxWidth, textWidth + 60);
  });

  // Tính toán kích thước SVG
  let svgWidth = maxWidth + 80;
  let svgHeight = steps.length * 100 + 40;
  let startX = (svgWidth - maxWidth) / 2; // Tính toán vị trí x bắt đầu của rect

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: auto;">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0d6efd"></polygon>
        </marker>
    </defs>`;

  steps.forEach((step, index) => {
    let rectColor = color;
    if (greenIndices && greenIndices.includes(index)) {
      rectColor = "#C1E5F5";
    }

    let y = 20 + index * 100;
    let centerX = svgWidth / 2; // Tính toán điểm giữa SVG

    if (step === "温度・湿度チェック（必要に応じて)") {
      svg += `<rect x="${startX}" y="${y}" width="${maxWidth}" height="60" rx="10" fill="${rectColor}"></rect>`;
      svg += `
            <text x="${centerX}" y="${
        y + 25
      }" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="black">
                <tspan x="${centerX}" dy="0">温度・湿度チェック</tspan>
                <tspan x="${centerX}" dy="20">（必要に応じて)</tspan>
            </text>`;
    } else {
      svg += `<rect x="${startX}" y="${y}" width="${maxWidth}" height="50" rx="10" fill="${rectColor}"></rect>`;
      svg += `<text x="${centerX}" y="${
        y + 30
      }" text-anchor="middle" font-size="14" fill="black">${step}</text>`;
    }

    if (index < steps.length - 1) {
      let arrowStartY =
        y + (step === "温度・湿度チェック（必要に応じて)" ? 60 : 50);
      svg += `<line x1="${centerX}" y1="${arrowStartY}" x2="${centerX}" y2="${
        y + 100
      }" stroke="#0d6efd" stroke-width="2" marker-end="url(#arrowhead)" />`;
    }
  });

  svg += `</svg>`;
  return svg;
}

function downloadScenarioSVG() {
  const flowContainer = document.getElementById("flow-container");
  if (!flowContainer) return;
  const svgElement = flowContainer.querySelector("svg");
  if (!svgElement) return;

  const svgContent = svgElement.outerHTML;
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scenario.svg";
  link.click();
}
