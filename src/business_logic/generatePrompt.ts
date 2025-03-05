import { ProcessedSchedule } from "../services/renshuuService";
import { LevelProgress } from "../store/slices/userSlice";
import { promptTemplates } from "./promptTemplates";

// Utility function to format the templates with the variables
function formatTemplate(str: string, replacements: Record<string, string>) {
    return str.replace(/{{(\w+)}}/g, (match: string, key: string) => {
        return key in replacements ? replacements[key] : match;
    });
}

// Function to format the list of terms from all schedules
function formatTermsList(
    allProcessedSchedules: ProcessedSchedule[],
    selectedWordsStatus: ('studied' | 'notStudied')[]
): string {
    let formattedSchedules: string[] = [];

    for (const schedule of allProcessedSchedules) {
        for (const [_scheduleId, scheduleData] of Object.entries(schedule)) {
            let scheduleContent: string[] = [];

            // Add schedule name
            scheduleContent.push(`* Schedule: ${scheduleData.name}`);

            // Add not studied words if selected
            if (selectedWordsStatus.includes('notStudied') && scheduleData.words.not_studied.length > 0) {
                const notStudiedWords = scheduleData.words.not_studied
                    .map(word => word.kanji || word.reading)
                    .join(' | ');
                scheduleContent.push(`** Not studied:`);
                scheduleContent.push(notStudiedWords);
            }

            // Add studied words if selected
            if (selectedWordsStatus.includes('studied') && scheduleData.words.studied.length > 0) {
                const studiedWords = scheduleData.words.studied
                    .map(word => `${word.kanji || word.reading} [[${word.encountered_count}, ${Math.round(word.mastery)}%]]`)
                    .join(' | ');
                scheduleContent.push(`** Studied:`);
                scheduleContent.push(studiedWords);
            }

            formattedSchedules.push(scheduleContent.join('\n'));
        }
    }

    return formattedSchedules.join('\n\n');
}

// Function to generate the prompt
export function generatePrompt(
    userLevel: string,
    levelProgress: LevelProgress,
    allProcessedSchedules: ProcessedSchedule[],
    conversationTopic: string,
    includeFurigana: boolean,
    excludeFuriganaWords: 'none' | 'all' | 'studied',
    includeSuperscript: boolean,
    selectedWordsStatus: ('studied' | 'notStudied')[],
) {

    let furiganaPart = "";
    if (includeFurigana) {
        console.log("excludeFuriganaWords ----", excludeFuriganaWords);
        let furiganaExclusson = "for all the KANJI";
        if (excludeFuriganaWords == "all") {
            furiganaExclusson = "for KANJI OUTSIDE my list (i.e any KANJI on my list, studied or not, should NOT have furigana)"
        } else if (excludeFuriganaWords == "studied") {
            furiganaExclusson = "for all the KANJI I have NOT studied (i.e any KANJI on my list, that is marked as studied, should NOT have furigana)"
        }
        furiganaPart = formatTemplate(promptTemplates.furigana, { limits: furiganaExclusson })
    }

    let superscriptPart = "";
    if (includeSuperscript) {
        let openLine = "";
        let furiganaClarification = "";
        let exampleLine = promptTemplates.superscriptNotFuriganaExample;
        if (includeFurigana) {
            openLine = "Also, ";
            furiganaClarification = "(after the furigana)";
            exampleLine = promptTemplates.superscriptFuriganaExample;
        }
        superscriptPart = formatTemplate(promptTemplates.superscript, { open: openLine, furigana_clarification: furiganaClarification, example: exampleLine })
    }

    const termsPart = formatTermsList(allProcessedSchedules, selectedWordsStatus);
    const levelPart = JSON.stringify(levelProgress);

    const userLevelPart = userLevel == "beginner" ? "total beginner" : userLevel;
    const conversationTopicPart = conversationTopic == ""
        ? promptTemplates.topicDefault :
         formatTemplate(promptTemplates.topicDefined, { topic: conversationTopic });


    const prompt = formatTemplate(promptTemplates.master, {
        userLevel: userLevelPart,
        levelProgress: levelPart,
        terms: termsPart,
        furigana: furiganaPart,
        superscript: superscriptPart,
        topic: conversationTopicPart
    })

    return prompt;

}
