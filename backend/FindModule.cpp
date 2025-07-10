#include <iostream>
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <fstream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <cctype>
#include <algorithm>

using namespace std;
namespace py = pybind11;

struct LineResult {
    int line_id;
    string text;
    unordered_map<string, int> pattern_matches; // Шаблон -> количество совпадений
};

unordered_map<char, int> buildSkipTable(const string& pattern) {
    unordered_map<char, int> skip_table;
    const int pattern_length = pattern.length();

    // Устанавливаем сдвиг по умолчанию (длина шаблона)
    skip_table['A'] = pattern_length;
    skip_table['C'] = pattern_length;
    skip_table['T'] = pattern_length;
    skip_table['G'] = pattern_length;

    // Корректируем сдвиги для символов в шаблоне (кроме последнего)
    for (int i = 0; i < pattern_length - 1; ++i) {
        skip_table[toupper(pattern[i])] = pattern_length - i - 1;
    }

    return skip_table;
}

bool boyerMooreHorspoolSearch(const string& text, const string& pattern) {
    const int text_length = text.length();
    const int pattern_length = pattern.length();
    if (pattern_length == 0) return false;

    const unordered_map<char, int> skip_table = buildSkipTable(pattern);
    int text_index = pattern_length - 1;

    while (text_index < text_length) {
        int pattern_index = pattern_length - 1;
        int current_text_index = text_index;

        // Сравниваем справа налево (регистронезависимо)
        while (pattern_index >= 0 &&
            toupper(text[current_text_index]) == toupper(pattern[pattern_index])) {
            --pattern_index;
            --current_text_index;
        }

        if (pattern_index < 0) {
            return true;
        }

        char current_char = toupper(text[text_index]);
        unordered_map<char, int>::const_iterator it = skip_table.find(current_char);
        text_index += (it != skip_table.end()) ? it->second : pattern_length;
    }

    return false;
}

//функция для подсчета вхождений
int countPatternOccurrences(const string& text, const string& pattern) {
    if (pattern.empty()) return 0;

    string textUpper = text;
    string patternUpper = pattern;
    transform(textUpper.begin(), textUpper.end(), textUpper.begin(), ::toupper);
    transform(patternUpper.begin(), patternUpper.end(), patternUpper.begin(), ::toupper);

    int count = 0;
    size_t pos = 0;
    while ((pos = textUpper.find(patternUpper, pos)) != string::npos) {
        ++count;
        pos += patternUpper.length();
    }
    return count;
}

vector<LineResult> searchPatternsInFile(
    const string& filename,
    const vector<string>& search_patterns) {

    vector<LineResult> results;
    ifstream file(filename.c_str());
    if (!file.is_open()) {
        cerr << "Error opening file: " << filename << endl;
        return results;
    }

    string current_line;
    while (getline(file, current_line)) {
        size_t colon_pos = current_line.find(':');
        if (colon_pos == string::npos) continue;

        LineResult line_result;
        line_result.line_id = stoi(current_line.substr(0, colon_pos));

        // Преобразуем текст к верхнему регистру
        string dna_sequence = current_line.substr(colon_pos + 2);
        transform(dna_sequence.begin(), dna_sequence.end(), dna_sequence.begin(), ::toupper);
        line_result.text = dna_sequence;

        bool has_any_match = false;
        for (const auto& pattern : search_patterns) {
            int count = countPatternOccurrences(dna_sequence, pattern);
            line_result.pattern_matches[pattern] = count;
            if (count > 0) has_any_match = true;
        }

        if (has_any_match) {
            results.push_back(line_result);
        }
    }

    file.close();
    return results;
}

PYBIND11_MODULE(find_module, m) {
    py::class_<LineResult>(m, "LineResult")
        .def_readonly("line_id", &LineResult::line_id)
        .def_readonly("text", &LineResult::text)
        .def_readonly("pattern_matches", &LineResult::pattern_matches);

    m.def("search_patterns", &searchPatternsInFile, "Search patterns in texts",
        py::arg("filename"), py::arg("patterns"));
}

