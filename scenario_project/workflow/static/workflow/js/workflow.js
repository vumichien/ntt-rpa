document.addEventListener("DOMContentLoaded", function () {
  // テキストエリアの自動拡張
  document.querySelectorAll(".auto-expand").forEach((textarea) => {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

    // 初期高さを設定
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  // ファイルアップロード機能を初期化する関数
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

        // ファイル入力が複数ある場合、すべての削除ボタンを表示
        const removeButtons = fileContainer.querySelectorAll(".remove-file");
        removeButtons.forEach((btn) => (btn.style.display = "block"));
      });

      // 削除ボタンのクリックをイベント委譲で処理
      fileContainer.addEventListener("click", function (e) {
        if (e.target.closest(".remove-file")) {
          const fileInputGroup = e.target.closest(".file-input-group");
          fileInputGroup.remove();

          // ファイル入力が1つしかない場合、削除ボタンを非表示
          const removeButtons = fileContainer.querySelectorAll(".remove-file");
          if (removeButtons.length === 1) {
            removeButtons[0].style.display = "none";
          }
        }
      });
    }
  }

  // すべてのコンテナのファイルアップロードを初期化
  initializeFileUpload("add-file-btn", "file-upload-container"); // カード1用
  initializeFileUpload(
    "add-file-btn-scenario",
    "file-upload-container-scenario"
  ); // カード2シナリオ用
  initializeFileUpload("add-file-btn-update", "file-upload-container-update"); // カード2更新情報用
  initializeFileUpload("add-file-btn-card3", "file-upload-container-card3"); // カード3用
});

function typeText(text, index, callback, elementId = "typing-text") {
  const typingElement = document.getElementById(elementId);
  if (index < text.length) {
    // "-"で始まる行を強調
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
  // すべてのセクションを非表示
  document.getElementById("card1-section").classList.add("d-none");
  document.getElementById("card2-section").classList.add("d-none");
  document.getElementById("card3-section").classList.add("d-none");
  document.getElementById("processing").classList.add("d-none");
  document.getElementById("summary-section").classList.add("d-none");
  document.getElementById("flow-section").classList.add("d-none");
  document.getElementById("flow-explanation").classList.add("d-none");
  document.getElementById("sample-image-section").classList.add("d-none");

  // すべてのカードのアクティブ状態を削除
  const cards = document.querySelectorAll("#card-section .card");
  cards.forEach((card) => card.classList.remove("active"));

  // 選択されたカードにアクティブ状態を追加
  const selectedCard = document.querySelector(
    `#card-section .col-md-4:nth-child(${cardNumber}) .card`
  );
  if (selectedCard) {
    selectedCard.classList.add("active");
  }

  // 選択されたセクションを表示
  if (cardNumber === 1) {
    document.getElementById("card1-section").classList.remove("d-none");
  } else if (cardNumber === 2) {
    document.getElementById("card2-section").classList.remove("d-none");
  } else if (cardNumber === 3) {
    document.getElementById("card3-section").classList.remove("d-none");
  }

  // カード切り替え時にマニュアルメニューを非表示
  const manualMenu = document.getElementById("manual-menu");
  if (manualMenu) {
    manualMenu.classList.add("d-none");
  }
}

function createScenario(cardNumber) {
  const processingElement = document.getElementById("processing");
  const summarySection = document.getElementById("summary-section");
  const flowSection = document.getElementById("flow-section");
  const flowExplanation = document.getElementById("flow-explanation");
  const summaryTitle = document.getElementById("summary-title");
  const sampleImageSection = document.getElementById("sample-image-section");
  if (cardNumber === 3) {
    summaryTitle.textContent = "マニュアル";
  } else {
    summaryTitle.textContent = "シナリオ";
  }
  // すべてのセクションを非表示
  [summarySection, flowSection, flowExplanation, sampleImageSection].forEach(
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

  // 処理中セクションを表示
  processingElement.classList.remove("d-none");
  processingElement.classList.add("fade-in");

  setTimeout(() => {
    processingElement.classList.add("fade-out");
    setTimeout(() => {
      processingElement.classList.add("d-none");
      processingElement.classList.remove("fade-out");

      // シナリオセクションを表示
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

        // シンプルなSVGフローを作成（垂直方向、カメラマン色#f7b066）
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
        summaryText = `<strong>旅費精算</strong>を行うには、出張する従業員に前もって概算で旅費を渡しておく<strong>「事前仮払い精算」</strong>という方法があります。
                
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

        // シナリオセクションに説明テキストを追加
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
          flowSection.classList.remove("d-none");
          flowSection.classList.add("fade-in");

          createFlowSVG(
            cardNumber === 1
              ? ["申請者情報の入力", "出張情報の入力", "旅費明細の入力"]
              : cardNumber === 2
              ? [
                  "納品書の確認",
                  "バーコードスキャン",
                  "商品の検品",
                  "温度・湿度チェック（必要に応じて)",
                  "作業記録の保存",
                ]
              : [
                  "1.出張前に従業員が仮払申請書を提出する",
                  "2.経理部が必要費用を確認する",
                  "3.従業員に仮払分の金額を渡す",
                  "4.出張後に従業員が仮払経費精算書を提出する",
                  "5.仮払いした金額と実費との差額を精算する",
                ],
            "#f7b066",
            cardNumber === 2 ? [1, 3] : [],
            // フローダイアグラムが完了した後に呼び出されるコールバック関数
            () => {
              if (explanationText) {
                setTimeout(() => {
                  flowExplanation.classList.remove("d-none");
                  flowExplanation.classList.add("fade-in");

                  if (cardNumber === 1 || cardNumber === 2) {
                    // メニューコンテナを非表示にし、explanationを全幅にする
                    document
                      .getElementById("manual-menu-container")
                      .classList.add("d-none");
                    document
                      .getElementById("explanation-column")
                      .classList.remove("col-md-9");
                    document
                      .getElementById("explanation-column")
                      .classList.add("col-md-12");

                    document.getElementById("flow-explanation-text").innerHTML =
                      explanationText;

                    if (cardNumber === 1) {
                      const sampleImageSection = document.getElementById(
                        "sample-image-section"
                      );
                      setTimeout(() => {
                        sampleImageSection.classList.remove("d-none");
                        sampleImageSection.classList.add("fade-in");
                      }, 500);
                    }
                  } else if (cardNumber === 3) {
                    // メニューコンテナを表示し、レイアウトを調整
                    document
                      .getElementById("manual-menu-container")
                      .classList.remove("d-none");
                    document
                      .getElementById("explanation-column")
                      .classList.remove("col-md-12");
                    document
                      .getElementById("explanation-column")
                      .classList.add("col-md-9");

                    // カード3のマニュアルメニューを表示
                    const manualMenu = document.getElementById("manual-menu");
                    manualMenu.classList.remove("d-none");

                    // メニューアイテムを作成し、表示
                    const menuItems =
                      document.getElementById("manual-menu-items");
                    menuItems.innerHTML = ""; // 既存のアイテムをクリア

                    // テキストからステップを抽出
                    const steps = explanationText
                      .split("-")
                      .filter((step) => step.trim());
                    const explanationElement = document.getElementById(
                      "flow-explanation-text"
                    );
                    explanationElement.innerHTML = ""; // 既存のコンテンツをクリア

                    // 各ステップとその説明を表示する関数
                    function showStepAndExplanation(index) {
                      if (index >= steps.length) return;

                      const step = steps[index];
                      const firstLine = step.split("\n")[0].trim();

                      // Create menu item
                      const menuItem = document.createElement("a");
                      menuItem.href = "#";
                      menuItem.className = "nav-link text-dark";
                      menuItem.textContent = firstLine;
                      menuItem.onclick = (e) => {
                        e.preventDefault();

                        // Remove active class from all menu items
                        menuItems.querySelectorAll(".nav-link").forEach((item) => {
                          item.classList.remove("active");
                        });

                        // Add active class to clicked item
                        menuItem.classList.add("active");

                        // Scroll to corresponding section
                        const sections = explanationElement.querySelectorAll(".explanation-section");
                        if (sections[index]) {
                          sections[index].scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      };

                      // Add menu item with fade-in effect
                      menuItem.style.opacity = "0";
                      menuItems.appendChild(menuItem);
                      setTimeout(() => {
                        menuItem.style.transition = "opacity 0.5s";
                        menuItem.style.opacity = "1";
                      }, 100);

                      // Create explanation section
                      const sectionDiv = document.createElement("div");
                      sectionDiv.className = "explanation-section mb-4";
                      sectionDiv.style.opacity = "0";

                      // Add image for specific steps
                      const image = document.createElement("img");
                      image.style.width = "100%"; // Adjust size as needed
                      image.style.marginBottom = "20px"; // Add padding between image and text
                      switch (index) {
                        case 0:
                          image.src = "/media/step1.png";
                          break;
                        case 1:
                          image.src = "/media/step2.png";
                          break;
                        case 3:
                          image.src = "/media/step4.png";
                          break;
                        case 4:
                          image.src = "/media/step5.png";
                          break;
                        default:
                          image.src = "";
                      }
                      if (image.src) {
                        sectionDiv.appendChild(image);
                      }

                      // Use typeText to display explanation content
                      const typingDiv = document.createElement("div");
                      sectionDiv.appendChild(typingDiv);
                      explanationElement.appendChild(sectionDiv);

                      // Display explanation section with fade-in effect
                      setTimeout(() => {
                        sectionDiv.style.transition = "opacity 0.5s";
                        sectionDiv.style.opacity = "1";

                        // Display text for this section
                        typeText(
                          step,
                          0,
                          () => {
                            // Show next step after current one is complete
                            setTimeout(() => {
                              showStepAndExplanation(index + 1);
                            }, 500);
                          },
                          (typingDiv.id = `typing-section-${index}`)
                        );
                      }, 500);
                    }

                    // Show steps and explanations
                    showStepAndExplanation(0);

                    // Initialize editor after content is loaded
                    initializeEditor();
                  }
                }, 500);
              }
            }
          );
        });
      }
    }, 500);
  }, 2000);
}

function createFlowSVG(steps, color, greenIndices = [], onComplete) {
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

  // サイズを計算
  let maxWidth = 120;
  steps.forEach((step) => {
    const textWidth = measureText(step);
    maxWidth = Math.max(maxWidth, textWidth + 60);
  });

  let svgWidth = maxWidth + 80;
  let svgHeight = steps.length * 100 + 40;
  let startX = (svgWidth - maxWidth) / 2;
  let centerX = svgWidth / 2;

  // SVGコンテナを作成
  const svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: auto;">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#0d6efd"></polygon>
      </marker>
    </defs>
  </svg>`;

  // SVGをDOMに挿入
  const flowContainer = document.getElementById("flow-container");
  flowContainer.innerHTML = svg;
  const svgElement = flowContainer.querySelector("svg");

  // nodeを作成する関数
  function createNode(step, index) {
    const y = 20 + index * 100;
    const rectColor = greenIndices.includes(index) ? "#C1E5F5" : color;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.style.opacity = "0";
    g.innerHTML =
      step === "温度・湿度チェック（必要に応じて)"
        ? `<rect x="${startX}" y="${y}" width="${maxWidth}" height="60" rx="10" fill="${rectColor}"></rect>
         <text x="${centerX}" y="${
            y + 25
          }" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="black">
           <tspan x="${centerX}" dy="0">温度・湿度チェック</tspan>
           <tspan x="${centerX}" dy="20">（必要に応じて)</tspan>
         </text>`
        : `<rect x="${startX}" y="${y}" width="${maxWidth}" height="50" rx="10" fill="${rectColor}"></rect>
         <text x="${centerX}" y="${
            y + 30
          }" text-anchor="middle" font-size="14" fill="black">${step}</text>`;

    return g;
  }

  // edgeを作成する関数
  function createEdge(index, step) {
    const y = 20 + index * 100;
    const height = steps[index].includes("温度・湿度チェック（必要に応じて)")
      ? 60
      : 50;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.style.opacity = "0";
    g.innerHTML = `<line x1="${centerX}" y1="${
      y + height
    }" x2="${centerX}" y2="${y + 100}" 
      stroke="#0d6efd" stroke-width="2" marker-end="url(#arrowhead)" />`;

    return g;
  }

  // 順番に要素を表示
  function animateElements(index = 0) {
    if (index >= steps.length) {
      // すべての要素が表示されたらコールバックを呼び出す
      if (onComplete) onComplete();
      return;
    }

    // nodeを作成し、表示
    const node = createNode(steps[index], index);
    svgElement.appendChild(node);

    // nodeのアニメーション
    setTimeout(() => {
      node.style.transition = "opacity 0.5s ease-in";
      node.style.opacity = "1";

      // edgeを作成し、表示（nodeが最後でない場合）
      if (index < steps.length - 1) {
        setTimeout(() => {
          const edge = createEdge(index, steps[index]);
          svgElement.appendChild(edge);

          // edgeのアニメーション
          setTimeout(() => {
            edge.style.transition = "opacity 0.5s ease-in";
            edge.style.opacity = "1";

            // 次のnodeに進む
            setTimeout(() => animateElements(index + 1), 300);
          }, 50);
        }, 300);
      } else {
        // nodeが最後の場合、アニメーションが完了したらコールバックを呼び出す
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, 50);
  }

  // アニメーションを開始
  setTimeout(() => animateElements(), 100);
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

function initializeEditor() {
  const explanationText = document.getElementById("flow-explanation-text");
  const toolbarTemplate = document.getElementById("editor-toolbar");
  let toolbar = null;

  // ツールバーを表示する関数
  function showToolbar(e) {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      if (!toolbar) {
        toolbar = toolbarTemplate.content.cloneNode(true).firstElementChild;
        document.body.appendChild(toolbar);

        // ツールバーボタンにイベントリスナーを追加
        toolbar.querySelectorAll("button").forEach((button) => {
          button.addEventListener("click", (e) => {
            e.preventDefault();
            const command = button.dataset.command;

            if (command === "delete") {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);
              range.deleteContents();
            } else if (command === "removeFormat") {
              removeAllFormatting();
            } else {
              formatText(command);
            }
            hideToolbar();
          });
        });
      }

      const rect = selection.getRangeAt(0).getBoundingClientRect();
      toolbar.style.display = "block";
      toolbar.style.top = `${
        window.scrollY + rect.top - toolbar.offsetHeight - 10
      }px`;
      toolbar.style.left = `${window.scrollX + rect.left}px`;
    }
  }

  // ツールバーを非表示にする関数
  function hideToolbar() {
    if (toolbar) {
      toolbar.style.display = "none";
    }
  }

  // イベントリスナーを追加
  explanationText.addEventListener("mouseup", showToolbar);
  document.addEventListener("mousedown", (e) => {
    if (toolbar && !toolbar.contains(e.target)) {
      hideToolbar();
    }
  });
}
function removeAllFormatting() {
  const selection = window.getSelection();
  if (!selection.toString()) return;

  const range = selection.getRangeAt(0);

  // 一時的なcontainerを作成
  const tempDiv = document.createElement("div");
  tempDiv.appendChild(range.cloneContents());

  // 純粋なテキストを取得
  const plainText = tempDiv.textContent || tempDiv.innerText;

  // 古いコンテンツを削除し、新しいテキストを挿入
  range.deleteContents();
  const textNode = document.createTextNode(plainText);
  range.insertNode(textNode);

  // selectionを更新してテキストの末端にカーソルを移動
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.setStartAfter(textNode);
  newRange.setEndAfter(textNode);
  selection.addRange(newRange);
}

function formatText(command) {
  const selection = window.getSelection();
  if (!selection.toString()) return;

  if (command === "askGPT") {
    showGPTPopup(selection);
    return;
  }

  const range = selection.getRangeAt(0);

  // spanの親を見つける
  let currentNode = selection.anchorNode;
  while (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
    currentNode = currentNode.parentNode;
  }

  // 現在のformatをチェック
  let existingFormats = {
    bold: false,
    underline: false,
    highlight: false,
  };

  // 要求されたformatが現在のformatと一致するかチェック
  let hasCurrentFormat = false;

  if (currentNode && currentNode.tagName === "SPAN") {
    existingFormats.bold = currentNode.style.fontWeight === "bold";
    existingFormats.underline =
      currentNode.style.textDecoration === "underline";
    existingFormats.highlight =
      currentNode.style.backgroundColor === "rgb(255, 243, 205)";

    switch (command) {
      case "bold":
        hasCurrentFormat = existingFormats.bold;
        break;
      case "underline":
        hasCurrentFormat = existingFormats.underline;
        break;
      case "highlight":
        hasCurrentFormat = existingFormats.highlight;
        break;
    }
  }

  // 新しいspanを作成し、formatを適用
  const span = document.createElement("span");

  // 新しいformatを適用し、現在のformatを保持
  switch (command) {
    case "bold":
      if (!hasCurrentFormat) span.style.fontWeight = "bold";
      if (existingFormats.underline) span.style.textDecoration = "underline";
      if (existingFormats.highlight) {
        span.style.backgroundColor = "#fff3cd";
        span.style.padding = "2px 4px";
      }
      break;
    case "underline":
      if (existingFormats.bold) span.style.fontWeight = "bold";
      if (!hasCurrentFormat) span.style.textDecoration = "underline";
      if (existingFormats.highlight) {
        span.style.backgroundColor = "#fff3cd";
        span.style.padding = "2px 4px";
      }
      break;
    case "highlight":
      if (existingFormats.bold) span.style.fontWeight = "bold";
      if (existingFormats.underline) span.style.textDecoration = "underline";
      if (!hasCurrentFormat) {
        span.style.backgroundColor = "#fff3cd";
        span.style.padding = "2px 4px";
      }
      break;
  }

  // formatを適用する処理
  try {
    if (
      currentNode &&
      currentNode.tagName === "SPAN" &&
      currentNode.contains(range.startContainer) &&
      currentNode.contains(range.endContainer)
    ) {
      // spanのstyleを更新
      if (hasCurrentFormat) {
        // formatが既に存在する場合、削除
        switch (command) {
          case "bold":
            currentNode.style.fontWeight = "";
            break;
          case "underline":
            currentNode.style.textDecoration = "";
            break;
          case "highlight":
            currentNode.style.backgroundColor = "";
            currentNode.style.padding = "";
            break;
        }

        // まだstyleが残っているかチェック
        const hasRemainingStyles =
          currentNode.style.fontWeight === "bold" ||
          currentNode.style.textDecoration === "underline" ||
          currentNode.style.backgroundColor === "rgb(255, 243, 205)";

        // styleが残っていない場合、spanをtext nodeに置き換え
        if (!hasRemainingStyles) {
          const textContent = currentNode.textContent;
          const textNode = document.createTextNode(textContent);
          currentNode.parentNode.replaceChild(textNode, currentNode);
        }
      } else {
        // formatが存在しない場合、追加
        switch (command) {
          case "bold":
            currentNode.style.fontWeight = "bold";
            break;
          case "underline":
            currentNode.style.textDecoration = "underline";
            break;
          case "highlight":
            currentNode.style.backgroundColor = "#fff3cd";
            currentNode.style.padding = "2px 4px";
            break;
        }
      }
    } else if (span.style.length > 0) {
      // spanがまだ存在しない場合、作成
      const surroundRange = range.cloneRange();
      surroundRange.surroundContents(span);
      range.setStart(surroundRange.startContainer, surroundRange.startOffset);
      range.setEnd(surroundRange.endContainer, surroundRange.endOffset);
    }
  } catch (e) {
    console.error("Error applying format:", e);
  }

  // クリーンアップ
  selection.removeAllRanges();
  selection.addRange(range);
  range.commonAncestorContainer.normalize();
}

function downloadExplanation() {
  const explanationText = document.getElementById("flow-explanation-text");
  const content = explanationText.innerHTML;

  // Function to convert image to base64
  function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }

  // Replace image sources with base64 data
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const images = tempDiv.querySelectorAll("img");
  images.forEach((img) => {
    const base64Image = getBase64Image(img);
    img.src = base64Image;
  });

  // Create HTML template
  const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>説明文書</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { padding: 20px; }
        .content { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="content">
        ${tempDiv.innerHTML}
    </div>
</body>
</html>`;

  // Create Blob and download
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "explanation.html";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// downloadボタンにイベントリスナーを追加
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("download-explanation");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadExplanation);
  }
});

// selectionとrangeを保存する変数
let savedSelection = null;
let savedRange = null;

function showGPTPopup(selection) {
  savedSelection = selection;
  savedRange = selection.getRangeAt(0);

  const existingPopup = document.querySelector(".gpt-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  const popupTemplate = document.getElementById("gpt-popup");
  const popup = popupTemplate.content.cloneNode(true).firstElementChild;

  const rect = savedRange.getBoundingClientRect();
  popup.style.top = `${window.scrollY + rect.bottom + 5}px`;
  popup.style.left = `${window.scrollX + rect.left}px`;

  const textarea = popup.querySelector(".gpt-popup-textarea");
  const sendButton = popup.querySelector(".gpt-popup-send");

  // textareaを自動的にリサイズ
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Enterキーを押したときの処理
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      replaceWithDetailedText();
    }
  });

  // sendボタンを押したときの処理
  sendButton.addEventListener("click", replaceWithDetailedText);

  document.body.appendChild(popup);
  textarea.focus();

  // 外側をクリックしたときにポップアップを閉じる
  document.addEventListener("mousedown", (e) => {
    if (!popup.contains(e.target)) {
      popup.remove();
    }
  });
}

function replaceWithDetailedText() {
  if (!savedRange) return;

  const sectionId = savedRange.startContainer.parentElement
    .closest(".explanation-section")
    ?.querySelector('[id^="typing-section-"]')?.id;

  if (sectionId) {
    const sectionNumber = parseInt(sectionId.split("-")[2]);
    let newText = "";

    // セクション番号に基づいて詳細なテキストをハードコード
    switch (sectionNumber) {
      case 0:
        newText = `<strong>1. 出張前に従業員が仮払申請書を提出する</strong>：

従業員は出張に行く前に、会社に対して旅費などの仮払いを申請するために「仮払申請書」を提出します。
この書類には、出張の日程、目的地、移動手段（電車、飛行機など）、および宿泊先などを記載し、予想される費用を計算して明記します。
仮払申請書は、従業員の直属の上司に提出され、内容の確認と承認を受ける必要があります。

<strong>例文</strong>：
   • 仮払申請書には、「〇月〇日～〇月〇日、大阪出張、往復新幹線代とホテル代」といった具体的な情報を記載します。
   • 上司に提出する際、「出張予定の詳細を確認していただけますか？」と伝えます。`;
        break;
      case 1:
        newText = `<strong>2. 経理部が必要費用を確認する</strong>：
上司が仮払申請書の内容を確認し、承認した後、その申請書は経理部に回されます。
経理担当者は、申請内容を詳細にチェックし、以下の点を確認します：
   • 費用が妥当かどうか（例えば、高級ホテルを選んでいないか）。
   • 記載内容に漏れや不備がないか。
もし申請内容に不備があれば、申請者に修正を依頼する場合もあります。

<strong>例文</strong>：
   • 経理部：「このタクシー代は具体的な利用時間やルートが記載されていません。追加で情報をいただけますか？」
   • 従業員：「了解しました。ルートの詳細を追記して再提出します。」`;
        break;
      case 2:
        newText = `<strong>3. 従業員に仮払分の金額を渡す</strong>：
経理担当者の確認が完了し、申請内容に問題がなければ、申請された仮払い金額が従業員に支払われます。
この際、従業員には受領印を押してもらうか、サインを求めることで、金銭の受け渡しが記録に残るようにします。

<strong>例文</strong>：
   • 経理部：「申請された金額〇万円をこちらで確認しました。受領印をお願いします。」
   • 従業員：「わかりました。こちらに印を押します。」`;
        break;
      case 3:
        newText = `<strong>4. 出張後に従業員が仮払経費精算書を提出する</strong>：
出張を終えた従業員は、出張中に実際にかかった費用を整理し、「仮払経費精算書」を作成します。この書類には、領収書や明細を添付し、具体的にどの費目にいくら支払ったのかを記載します。
仮払金をどのように使ったかを会社に報告するための重要な手続きです。

<strong>例文</strong>：
   • 従業員：「出張時のホテル代の領収書と電車代の領収書を添付しました。」
   • 上司：「内容を確認します。領収書が漏れていないか確認してください。」`;
        break;
      case 4:
        newText = `<strong>5. 仮払いした額と実費との差額を精算する</strong>：
従業員が作成した「仮払経費精算書」は上司に提出され、承認を得た後に経理部に送られます。
経理部では、領収書と精算書の内容を確認し、以下のように差額を処理します：
   • 仮払い金が実費より多かった場合：従業員が会社に差額を返金します。
   • 仮払い金が実費より少なかった場合：会社が不足分を従業員に追加支給します。

<strong>例文</strong>：
   • 経理部：「仮払金が実費より1,000円多かったため、こちらの振込用紙で返金をお願いします。」
   • 従業員：「了解しました。明日までに返金手続きを行います。」`;
        break;
      default:
        newText = selection.toString();
    }

    // テキストを置換する前にselectionを復元
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);

    // typeTextを使用してテキストを置換
    typeText(
      newText,
      0,
      () => {
        // 置換後にsaved selectionをクリア
        savedSelection = null;
        savedRange = null;
      },
      sectionId
    );
  }

  // ポップアップを削除
  const popup = document.querySelector(".gpt-popup");
  if (popup) {
    popup.remove();
  }
}

