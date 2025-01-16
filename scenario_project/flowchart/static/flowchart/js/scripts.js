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
      let explanationText = "";

      if (cardNumber === 1) {
        summaryText = `この画面は、<strong>旅費精算申請</strong>を行うためのフォームです。申請者情報、出張期間、目的地、目的、旅費明細などの情報を入力することで、上司に申請を提出できます。
主な構成は以下の通りです：

<strong>申請者情報:</strong> 申請者および承認者の情報を入力します。
<strong>出張情報:</strong> 出張期間、目的地、目的、日当額を設定します。
<strong>旅費明細:</strong> 出張中の交通手段や詳細な費用を入力します。`;

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
        summaryText = `<strong>変更点:</strong>
1. 確認ダイアログの処理が追加されている: 
• 申請実行後に表示される確認ダイアログ（「申請を実行しますか？」）の処理が含まれている。
• ダイアログが表示された場合、「OK」ボタンをクリックして申請を確定する手順が追加。

2. 業務終了後に以下の後処理が実行される:
• 経費精算システムのブラウザを閉じる。
• 開いていたExcelファイルを閉じる。

<strong>主な改善点：</strong>
1. 完全な業務処理の保証:
• 確認ダイアログを操作し、申請確定の確認を自動化。

2. リソース管理の徹底:
• 処理終了後に使用リソース（ブラウザ・Excel）を解放することで、システムの安定性を向上。`;

        explanationText = `
<div class="row">
  <div class="col-md-6">
    <h5>変更前のスクリプト:</h5>
    <pre class="code-block old-script"><code>
'***********************************************
' 出張旅費請求<span class="text-danger">簡易版</span>自動化スクリプト
' 概要：Excelの出張記録から経費精算システムへの自動入力を行う<span class="text-danger">（簡易版）</span>
'***********************************************

Sub Main()
    ' Excel出張記録を開く
    OpenExcel("C:\Travel\TravelExpense.xlsx", "出張記録")
    
    ' 経費精算システムを開く
    OpenIE("http://expense-system.company.co.jp")
    
    ' ログイン処理
    IE_SetText("ID", "\${従業員ID}")
    IE_SetText("Password", "\${パスワード}")
    IE_Click("ログイン")
    
    ' 新規申請画面へ遷移
    IE_Click("新規申請")
    IE_Click("出張旅費精算")
    
    ' Excelから出張データを読み取り
    row = 2  '2行目からデータ開始
    Do While Excel_GetValue(row, 1) <> ""
        ' 出張情報を取得
        出張日 = Excel_GetValue(row, 1)
        用務地 = Excel_GetValue(row, 2)
        用務内容 = Excel_GetValue(row, 3)
        交通費 = Excel_GetValue(row, 4)
        宿泊費 = Excel_GetValue(row, 5)
        日当 = Excel_GetValue(row, 6)
        
        ' 経費システムに入力
        IE_SetText("出張日", 出張日)
        IE_SetText("用務地", 用務地)
        IE_SetText("用務内容", 用務内容)
        IE_SetText("交通費", 交通費)
        IE_SetText("宿泊費", 宿泊費)
        IE_SetText("日当", 日当)
        
        ' 明細行追加
        IE_Click("明細追加")
        
        row = row + 1
    Loop
    
    ' 申請実行
    IE_Click("申請")
End Sub

'エラーハンドリング
On Error Resume Next
If Err.Number <> 0 Then
    MessageBox("エラーが発生しました。: " & Err.Description)
End If</code></pre>
  </div>
  <div class="col-md-6">
    <h5>変更後のスクリプト:</h5>
    <pre class="code-block new-script" id="new-script"><code>
'***********************************************
' 出張旅費請求自動化スクリプト
' 概要：Excelの出張記録から経費精算システムへの自動入力を行う
'***********************************************

Sub Main()
    ' Excel出張記録を開く
    OpenExcel("C:\Travel\TravelExpense.xlsx", "出張記録")
    
    ' 経費精算システムを開く
    OpenIE("http://expense-system.company.co.jp")
    
    ' ログイン処理
    IE_SetText("ID", "\${従業員ID}")
    IE_SetText("Password", "\${パスワード}")
    IE_Click("ログイン")
    
    ' 新規申請画面へ遷移
    IE_Click("新規申請")
    IE_Click("出張旅費精算")
    
    ' Excelから出張データを読み取り
    row = 2  '2行目からデータ開始
    Do While Excel_GetValue(row, 1) <> ""
        ' 出張情報を取得
        出張日 = Excel_GetValue(row, 1)
        用務地 = Excel_GetValue(row, 2)
        用務内容 = Excel_GetValue(row, 3)
        交通費 = Excel_GetValue(row, 4)
        宿泊費 = Excel_GetValue(row, 5)
        日当 = Excel_GetValue(row, 6)
        
        ' 経費システムに入力
        IE_SetText("出張日", 出張日)
        IE_SetText("用務地", 用務地)
        IE_SetText("用務内容", 用務内容)
        IE_SetText("交通費", 交通費)
        IE_SetText("宿泊費", 宿泊費)
        IE_SetText("日当", 日当)
        
        ' 明細行追加
        IE_Click("明細追加")
        
        row = row + 1
    Loop
    
    ' 申請実行
    IE_Click("申請")
    
    ' 確認ダイアログの処理
    If IE_Exists("申請を実行しますか？") Then
        IE_Click("OK")
    End If
    
    ' 完了確認
    Wait(3)  '処理完了まで待機
    If IE_Exists("申請が完了しました") Then
        MessageBox("出張旅費の申請が完了しました。")
    Else
        MessageBox("エラーが発生した可能性があります。確認してください。")
    End If
    
    ' ブラウザを閉じる
    CloseIE()
    
    ' Excelを閉じる
    CloseExcel()
End Sub

'エラーハンドリング
On Error Resume Next
If Err.Number <> 0 Then
    MessageBox("エラーが発生しました。: " & Err.Description)
    CloseIE()
    CloseExcel()
End If</code></pre>
  </div>
</div>
<style>
  .code-block {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    font-family: monospace;
    white-space: pre;
    font-size: 12px;
  }
  .text-danger {
    color: #dc3545;
    background-color: #ffe6e6;
  }
  .text-success {
    color: #28a745;
    background-color: #e6ffe6;
  }
</style>`;
      } else if (cardNumber === 3) {
        summaryText = `<strong>旅費精算</strong>を行うには、出張する従業員に前もって概算で旅費を渡しておく<strong>「事前仮払い精算」</strong>という方法があります。
                
                <strong>事前仮払精算</strong>
                仮払いは、出張にかかる費用を概算で見積もり、あらかじめ従業員に渡しておく方法です。出張を終え、実際にかかった金額と仮払い金額に差額があった場合は、追加支給や返金などの精算を行います。

特に海外出張や長期出張などの場合、かかる費用はかなり高額になることが予想されます。時的とはいえ、その費用を出張が終わるまですべて従業員に立て替えさせるのは無理があるでしょう。「事前仮払方式」なら、出張中に必要な費用を事前に渡しておけるので、従業員に金銭的な負担をかけずに済みます。ただし、出張前と出張後にそれぞれ処理が必要になるため、そのぶん手間がかかります。

仮払いで旅費精算を行う流れは、下記のとおりです。`;

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

          // カード番号に基づいてstepsとflowConnectionsを決定
          let steps, highlightIndices, connections;

          if (cardNumber === 1) {
            steps = ["申請者情報の入力", "出張情報の入力", "旅費明細の入力"];
            highlightIndices = [];
            connections = null;
          } else if (cardNumber === 2) {
            steps = [
              "Excelファイルを開く",
              "経費精算システムを開く",
              "ログイン処理",
              "新規申請画面へ遷移",
              "Excelから出張データを読み取り",
              "申請実行",
              "処理完了確認",
              "後処理",
              "エラーハンドリング",
            ];
            highlightIndices = [6, 7];
            connections = [
              { from: 0, to: 1 },
              { from: 1, to: 2 },
              { from: 2, to: 3 },
              { from: 3, to: 4 },
              { from: 4, to: 5 },
              { from: 5, to: 6, condition: "成功" },
              { from: 5, to: 8, condition: "失敗" },
              { from: 6, to: 7 },
            ];
          } else {
            steps = [
              "1.出張前に従業員が仮払申請書を提出する",
              "2.経理部が必要費用を確認する",
              "3.従業員に仮払分の金額を渡す",
              "4.出張後に従業員が仮払経費精算書を提出する",
              "5.仮払いした金額と実費との差額を精算する",
            ];
            highlightIndices = [];
            connections = null;
          }

          // フローダイアグラムを作成
          createFlowSVG(
            steps,
            "#f7b066",
            highlightIndices,
            // フローダイアグラムが完了した後のコールバック関数
            () => {
              if (explanationText) {
                setTimeout(() => {
                  flowExplanation.classList.remove("d-none");
                  flowExplanation.classList.add("fade-in");

                  if (cardNumber === 1 || cardNumber === 2) {
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

                      // メニューアイテムを作成
                      const menuItem = document.createElement("a");
                      menuItem.href = "#";
                      menuItem.className = "nav-link text-dark";
                      menuItem.textContent = firstLine;
                      menuItem.onclick = (e) => {
                        e.preventDefault();

                        // すべてのメニューアイテムからアクティブクラスを削除
                        menuItems
                          .querySelectorAll(".nav-link")
                          .forEach((item) => {
                            item.classList.remove("active");
                          });

                        // クリックされたアイテムにアクティブクラスを追加
                        menuItem.classList.add("active");

                        // 対応するセクションを見つけてスクロール
                        const sections = explanationElement.querySelectorAll(
                          ".explanation-section"
                        );
                        if (sections[index]) {
                          sections[index].scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      };

                      // メニューアイテムをフェードイン効果で追加
                      menuItem.style.opacity = "0";
                      menuItems.appendChild(menuItem);
                      setTimeout(() => {
                        menuItem.style.transition = "opacity 0.5s";
                        menuItem.style.opacity = "1";
                      }, 100);

                      // 説明セクションを作成
                      const sectionDiv = document.createElement("div");
                      sectionDiv.className = "explanation-section mb-4";
                      sectionDiv.style.opacity = "0";

                      // typeTextを使用して説明コンテンツを表示
                      const typingDiv = document.createElement("div");
                      sectionDiv.appendChild(typingDiv);
                      explanationElement.appendChild(sectionDiv);

                      // 説明セクションをフェードイン効果で表示
                      setTimeout(() => {
                        sectionDiv.style.transition = "opacity 0.5s";
                        sectionDiv.style.opacity = "1";

                        // このセクションのテキストを表示
                        typeText(
                          step,
                          0,
                          () => {
                            // 入力が完了したら次のステップを表示
                            setTimeout(() => {
                              showStepAndExplanation(index + 1);
                            }, 500);
                          },
                          (typingDiv.id = `typing-section-${index}`)
                        );
                      }, 500);
                    }

                    // ステップを表示開始
                    showStepAndExplanation(0);

                    // コンテンツがロードされた後にエディタを初期化
                    initializeEditor();
                  }
                }, 500);
              }
            },
            connections
          );
        });
      }
    }, 500);
  }, 2000);
}

function createFlowSVG(
  steps,
  color,
  greenIndices = [],
  onComplete,
  flowConnections = null
) {
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

  // テキストの長さに基づいてmaxWidthを計算
  let maxWidth = 120;
  steps.forEach((step) => {
    const textWidth = measureText(step);
    maxWidth = Math.max(maxWidth, textWidth + 60);
  });

  // ブランチ間の距離を増やす
  const branchOffset = maxWidth * 0.8; // 0.6から0.8に増加

  // 必要な総幅を計算
  let totalWidth = maxWidth;
  if (flowConnections) {
    // 各レベルでの最大ブランチ数を見つける
    const branchCounts = {};
    flowConnections.forEach((conn) => {
      if (conn.condition) {
        branchCounts[conn.from] = (branchCounts[conn.from] || 0) + 1;
      }
    });
    const maxBranches = Math.max(...Object.values(branchCounts), 0);
    // ブランチ数に基づいて必要な幅を計算
    totalWidth = maxWidth + branchOffset * maxBranches;
  }

  // SVGのパディングを追加
  const svgWidth = totalWidth + 200; // パディングを増やす
  const svgHeight = steps.length * 100 + 40;
  const centerX = svgWidth / 2;

  // 各ノードのX位置を計算
  let nodePositions = new Array(steps.length).fill(centerX);
  if (flowConnections) {
    const branchNodes = flowConnections.reduce((acc, conn) => {
      if (conn.condition) {
        if (!acc[conn.from]) {
          acc[conn.from] = [];
        }
        acc[conn.from].push(conn);
      }
      return acc;
    }, {});

    Object.entries(branchNodes).forEach(([fromIndex, connections]) => {
      connections.forEach((conn, i) => {
        let currentNode = conn.to;
        const xOffset = (i === 0 ? -1 : 1) * branchOffset;
        while (currentNode < steps.length) {
          nodePositions[currentNode] = centerX + xOffset;
          const nextConn = flowConnections.find((c) => c.from === currentNode);
          if (!nextConn || nextConn.condition) break;
          currentNode = nextConn.to;
        }
      });
    });
  }

  // SVGコンテナを新しい幅で更新
  const svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: auto;">
    <defs>
      <marker 
        id="arrowhead" 
        markerWidth="10" 
        markerHeight="7" 
        refX="10" 
        refY="3.5" 
        orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#0d6efd"/>
      </marker>
    </defs>
  </svg>`;

  // createNode関数を更新して新しい位置を使用
  function createNode(step, index) {
    const y = 20 + index * 100;
    const x = nodePositions[index] - maxWidth / 2;
    const rectColor = greenIndices.includes(index) ? "#C1E5F5" : color;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.style.opacity = "0";
    g.innerHTML = `<rect x="${x}" y="${y}" width="${maxWidth}" height="50" rx="10" fill="${rectColor}"></rect>
         <text x="${nodePositions[index]}" y="${
      y + 30
    }" text-anchor="middle" font-size="14" fill="black">${step}</text>`;

    return g;
  }

  // SVGをDOMに挿入
  const flowContainer = document.getElementById("flow-container");
  flowContainer.innerHTML = svg;
  const svgElement = flowContainer.querySelector("svg");

  // flowConnectionsが提供されていない場合のデフォルト
  if (!flowConnections) {
    // デフォルトのシーケンシャル接続を作成
    flowConnections = steps.slice(0, -1).map((_, i) => ({
      from: i,
      to: i + 1,
      condition: null,
    }));
  }

  // animateElements関数を更新してflowConnectionsを使用
  function animateElements(index = 0) {
    if (index >= steps.length) {
      if (onComplete) onComplete();
      return;
    }

    const node = createNode(steps[index], index);
    svgElement.appendChild(node);

    setTimeout(() => {
      node.style.transition = "opacity 0.5s ease-in";
      node.style.opacity = "1";

      // 現在のノードからのすべての接続を見つける
      const connections = flowConnections.filter((conn) => conn.from === index);

      if (connections.length > 0) {
        setTimeout(() => {
          connections.forEach((conn, i) => {
            const edge = createEdge(conn.from, conn.to, conn.condition);
            svgElement.appendChild(edge);

            setTimeout(() => {
              edge.style.transition = "opacity 0.5s ease-in";
              edge.style.opacity = "1";

              // 最後の接続の場合のみ次のノードに進む
              if (i === connections.length - 1) {
                setTimeout(() => animateElements(index + 1), 300);
              }
            }, 50);
          });
        }, 300);
      } else if (index < steps.length - 1) {
        setTimeout(() => animateElements(index + 1), 300);
      } else {
        if (onComplete) onComplete();
      }
    }, 50);
  }

  function createEdge(fromIndex, toIndex, condition = null) {
    const fromY = 20 + fromIndex * 100;
    const toY = 20 + toIndex * 100;
    const fromHeight = steps[fromIndex].includes(
      "温度・湿度チェック（必要に応じて)"
    )
      ? 60
      : 50;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.style.opacity = "0";

    const fromX = nodePositions[fromIndex];
    const toX = nodePositions[toIndex];

    if (condition) {
      // ブランチのための折れ線を作成
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const midY = (fromY + fromHeight + toY) / 2;

      path.setAttribute(
        "d",
        `M ${fromX} ${fromY + fromHeight} 
         L ${fromX} ${midY} 
         L ${toX} ${midY} 
         L ${toX} ${toY}`
      );
      path.setAttribute("stroke", "#0d6efd");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");
      path.setAttribute("marker-end", "url(#arrowhead)");

      // テキスト条件の位置を調整
      const textX = (fromX + toX) / 2;
      const textY = midY - 10;
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", textX);
      text.setAttribute("y", textY);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#0d6efd");
      text.setAttribute("font-size", "12");
      text.textContent = condition;

      g.appendChild(path);
      g.appendChild(text);
    } else {
      // 通常のフローのための直線を作成
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", fromX);
      line.setAttribute("y1", fromY + fromHeight);
      line.setAttribute("x2", toX);
      line.setAttribute("y2", toY);
      line.setAttribute("stroke", "#0d6efd");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("marker-end", "url(#arrowhead)");
      g.appendChild(line);
    }

    return g;
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
