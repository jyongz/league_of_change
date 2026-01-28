const baseURL = 'https://adb-7405616962374519.19.azuredatabricks.net/api/2.0/genie/'
const spaceId = '01f0fc610df7159297b12ffbfbdc58d9'
const token = ''

const delay = ms => new Promise(res => setTimeout(res, ms));

async function startConversationRequest(prompt) {
  try {
    const postResponse = await fetch(baseURL + 'spaces/' + spaceId + '/start-conversation',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}`, },
        body: JSON.stringify({ 'content': prompt }),
      });
    if (!postResponse.ok) {
      throw new Error(`POST request failed' + ${postResponse.statusText}`);
    }
    const postResponseData = await postResponse.json();
    ;

    await delay(8000)
    try {
      const getResponse = await fetch(baseURL + 'spaces/' + spaceId + '/conversations/' + postResponseData["conversation_id"] + '/messages/' + postResponseData["message_id"],
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}`, },
        });

      if (!getResponse.ok) {
        throw new Error('GET request failed: ${getResponse.statusText}');
      } const getResponseData = await getResponse.json();
      const content = getResponseData['attachments']
      for (let i = 0; i < content.length; i++) {
        const item = content[i]
        if (item && typeof item == 'object' && !Array.isArray(item)) {
          const keys = Object.keys(item);
          if (keys.some(key => key.includes("text"))) {
            console.log(item["text"])
            return item["text"]
          }
        }
      }
      console.log('GET Response:', getResponseData['content']);
    } catch (error) {
      console.error('Error with GET request:', error);
    }
  } catch (error) {
    console.error('Error with POST request:', error);

  }
}

async function main() {
const example = "Identify which lesson plans are associated with the highest average skill improvement by comparing initial and current proficiency in skill achievements per lesson."
// const example = "Analyze the relationship between participant attendance rates and their outcome achievements to determine if higher attendance correlates with better outcomes."
// const example ="Compare engagement, confidence, and motivation scores across different product types or academies to find which programs are most effective."
// const example = "Track the sustainability of positive outcomes (e.g., employment, education) by product type or cohort to see which programs lead to long-term success."
// const example = "Evaluate staff impact by linking session leadership to participant progress and outcome data, identifying which staff members consistently drive the best results."
  const response = await startConversationRequest(example);
  console.log('Response from conversation:', response);  
}

main(); 