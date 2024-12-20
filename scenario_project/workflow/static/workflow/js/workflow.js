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

  // Add file input handling
  const addFileBtn = document.getElementById("add-file-btn");
  const fileContainer = document.getElementById("file-upload-container");

  if (addFileBtn && fileContainer) {
    addFileBtn.addEventListener("click", function () {
      const newFileInput = document.createElement("div");
      newFileInput.className = "mb-3 file-input-group";
      newFileInput.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <div class="position-relative flex-grow-1">
                        <input type="file" class="form-control pe-5" name="feedbackFile">
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
  document.getElementById("flow-explanation").classList.add("d-none");
  document.getElementById("summary-sub-section").classList.add("d-none");
  document.getElementById("flow-section-sub").classList.add("d-none");
  document
    .getElementById("flow-explanation-sub-section")
    .classList.add("d-none");

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

function createScenario(cardNumber) {
  const processingElement = document.getElementById("processing");
  const summarySection = document.getElementById("summary-section");
  const flowSection = document.getElementById("flow-section");
  const flowExplanation = document.getElementById("flow-explanation");
  const summarySubSection = document.getElementById("summary-sub-section");
  const flowSubSection = document.getElementById("flow-section-sub");
  const flowExplanationSubSection = document.getElementById(
    "flow-explanation-sub-section"
  );

  // Ẩn các section khác với hiệu ứng fade
  [summarySection, flowSection, flowExplanation, summarySubSection].forEach(
    (section) => {
      if (!section.classList.contains("d-none")) {
        section.classList.add("fade-out");
        setTimeout(() => {
          section.classList.add("d-none");
          section.classList.remove("fade-out");
        }, 500);
      }
    }
  );

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
      let summarySubText = "";
      let svgContentSub = "";
      let explanationTextSub = "";

      if (cardNumber === 1) {
        summaryText = `実行する必要がある操作の内容を要約する
-納品書の確認: 納品書と注文書を照る。数量、品名、品番などを確認する。
-入庫記録の入力: システムに納品内容を入力する（例: 商品名、数量、入庫日）。
-商品の検品: 商品に破損や不良品がないか検査する。
-保管場所の決定: 商品を保管する棚やエリアを決定する。
-作業記録の保存: システムに作業の進捗と完了情報を記録する。`;

        // Tạo SVG flow đơn giản (theo chiều dọc, màu cam #f7b066)
        svgContent = createFlowSVG(
          [
            "納品書の確認",
            "入庫記録の入力",
            "商品の検品",
            "保管場所の決定",
            "作業記録の保存",
          ],
          "#f7b066"
        );
      } else if (cardNumber === 2) {
        summaryText = `変更内容の要約:
-追加: 「バーコードスキャン」と「温度・湿度チェック」ステップを導入。
-削除: 「保管場所の決定」をシステムによる自動化に変更。
-変更: 「入庫記録の入力」をバーコードスキャンによる自動入力へ改善。`;

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
      } else if (cardNumber === 3) {
        summaryText = `<strong>旅費精算</strong>を行うには、出張する従業員に前もって概算で旅費を渡しておく<strong>「事前仮払い精算」</strong>と、いったん従業員が全額を立て替えてから後日精算する<strong>「事後精算」</strong>の、大きく2つの方法があります。どちらの方法を選ぶかで、旅費精算の流れは変わります。
                ここでは、旅費精算の2つの方法について、それぞれ説明します。
                
                <strong>事前仮払精算</strong>
                仮払いは、出張にかかる費用を概算で見積もり、あらかじめ従業員に渡しておく方法です。出張を終え、実際にかかった金額と仮払い金額に差額があった場合は、追加支給や返金などの精算を行います。

特に海外出張や長期出張などの場合、かかる費用はかなり高額になることが予想されます。時的とはいえ、その費用を出張が終わるまですべて従業員に立て替えさせるのは無理があるでしょう。「事前仮払方式」なら、出張中に必要な費用を事前に渡しておけるので、従業員に金銭的な負担をかけずに済みます。ただし、出張前と出張後にそれぞれ処理が必要になるため、そのぶん手間がかかります。

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

-5. 仮払いした金額と実費との差額を精算する
業員が作成した仮払経費精算書は、上司の承認を経て、領収書などとともに経理部に提出されます。経理担当者は内容を確認し、仮払金に余剰や不足があった場合は返金や追加支払いを行います。`;

        summarySubText = `<strong>事後精算</strong>
        事後精算は、出張にかかる費用を従業員が立て替え、後日、実費精算をする方法です。出張にかかる費用は従業員が一時的に自費で支払い、後日その領収書を会社に提出して、立て替えたお金の払い戻しを受けます。事後精算方式は、精算処理が一度で済むため事務手続きがシンプルです。しかし、実際に旅費精算を行うまでの間、従業員に金銭的な負担をかけることになります。
        事後精算の場合は、下記のような流れで旅費精算を行います。`;

        const flowStepsSub = [
          "1.出張前に従業員が旅費の申請をする",
          "2.出張中の経費を立て替える",
          "3.領収書をもとに従業員が旅費精算書を作成する",
          "4.旅費精算書を提出し、上司の承認を得る",
          "5.経理部が旅費精算書を確認する",
          "6.小口現金や振込などで精算する",
        ];
        svgContentSub = createFlowSVG(flowStepsSub, "#f7b066");

        explanationTextSub = `-1. 出張前に従業員が旅費の申請をする
        出張する従業員は、事前に必要な金額を上司または経理部に申請します。出張にかかる費用は高額になることが多いため、事前に申請しておことで後の旅費精算がスムースになります。

-2. 出張中の経費を立て替える
出張中は、必要な費用を従業員が立て替えて支払います。立替払いにあたって受け取った領収書やレシートは、必ず保管しておかなければなりません。

-3. 領収書をもとに従業員が旅費精算書を作成する
出張から戻った従業員は、領収書などをもとに旅費精算書を作成します。旅費精算書には、費用の項目や目的、金額などを漏れなく記載します。

-4. 旅費精算書を提出し、上司の承認を得る
従業員は作成した旅費精算書を領収書に上司に提出します。上司は事前申請と旅費精算書を比較し、予定外の支出がないかなどを確認します。確認後、問題がなければ、上司の承認を経て経理部に旅費精算書が提出されます。

-5. 経理部が旅費精算書を確認する
経理担当者は、提出された旅費精算書を細かくチェックします。記載内容や計算に誤りはないか、計上されている金額は適切か、経費とみなされない費用が含まれていないかなど、しっかりと精査が必要です。経理担当者によるチェックで漏れやミスが見つかった場合は、差し戻しとなります。

-6. 小口現金や振込などで精算する
経理担当者によるチェックで問題なければ、従業員に精算金が支給されます。精算方法は、小口現金での支払いや銀行振込、翌月の給与と合算しての支払いなど、会社によって異なります。`;
      }
      if (summaryText) {
        typeText(summaryText, 0, () => {
          // Sau khi summaryText hoàn thành, hiện flowSection
          if (svgContent) {
            flowSection.classList.remove("d-none");
            flowSection.classList.add("fade-in");
            const flowContainer = document.getElementById("flow-container");
            flowContainer.innerHTML = svgContent;

            // Sau khi flowSection hiện, hiện và type explanationText
            if (explanationText) {
              setTimeout(() => {
                flowExplanation.classList.remove("d-none");
                flowExplanation.classList.add("fade-in");
                typeText(
                  explanationText,
                  0,
                  () => {
                    // Sau khi explanationText hoàn thành, hiện và type summarySubText
                    if (summarySubText) {
                      setTimeout(() => {
                        summarySubSection.classList.remove("d-none");
                        summarySubSection.classList.add("fade-in");
                        typeText(
                          summarySubText,
                          0,
                          () => {
                            // Sau khi summarySubText hoàn thành, hiện flowSvgSubSection
                            if (svgContentSub) {
                              setTimeout(() => {
                                flowSubSection.classList.remove("d-none");
                                flowSubSection.classList.add("fade-in");
                                const flowContainerSub =
                                  document.getElementById("flow-container-sub");
                                flowContainerSub.innerHTML = svgContentSub;

                                // Sau khi flowSvgSubSection hiện, hiện và type explanationTextSub
                                if (explanationTextSub) {
                                  setTimeout(() => {
                                    flowExplanationSubSection.classList.remove(
                                      "d-none"
                                    );
                                    flowExplanationSubSection.classList.add(
                                      "fade-in"
                                    );
                                    typeText(
                                      explanationTextSub,
                                      0,
                                      () => {},
                                      "flow-explanation-text-sub-section"
                                    );
                                  }, 500);
                                }
                              }, 500);
                            }
                          },
                          "typing-text-sub-section"
                        );
                      }, 500);
                    }
                  },
                  "flow-explanation-text"
                );
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
