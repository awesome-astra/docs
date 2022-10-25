#!/usr/bin/env python3

import re
import os
import sys
try:
    import emoji
except ImportError:
    print('Please install emoji>=2.1.0 and re-run')
    sys.exit(0)


# non-greedy-matching finders for candidate URLS
# (either in parentheses or in quotes, because markdown/html)
quoted_RE = re.compile('"(\S*?)"')
paren_RE = re.compile('\((\S*?)\)')
ALLOWED_EMOJIS = {'™'}

def extract_bad_emojis(text):
    return (
        found['emoji']
        for found in emoji.emoji_list(text)
        if found['emoji'] not in ALLOWED_EMOJIS
    )


def is_relative_ref(ref):
    if '../../' in ref:
        return True
    if ref and ref[0] == '/':
        return True


def get_line_warnings(line):
    warnings = []
    # 1. find emojis in text
    emojis = set(extract_bad_emojis(line))
    if emojis:
        warnings.append(f"Found emojis: {','.join(emojis)}")
    # 2. find relative links
    relative_refs = [
        ref
        for ref in get_refs(line)
        if is_relative_ref(ref)
    ]
    for rr in relative_refs:
        warnings.append(f'Relative reference: "{rr}"')
    #
    return warnings

def get_warnings(line_list):
    return {
        _i: _w
        for _i, _w in {
            line_i: get_line_warnings(line)
            for line_i, line in enumerate(line_list)
        }.items()
        if _w
    }


def get_refs(txt):
    return {
        mtch
        for finder in (quoted_RE, paren_RE)
        for mtch in finder.findall(txt)
    }


def wh_eligible(line_list):
    if line_list:
        return all([
            line_list[0] == '---',
            any(
                'developer_title' in line
                for line in line_list[:20]
            )
        ])
    else:
        return False


def load_lines(file_path):
    return [
        line.strip()
        for line in open(file_path).readlines()
    ]


def recursive_find_files(dir0, predicate):
    here_files = (
        (dir0, fn)
        for fn in os.listdir(dir0)
        if os.path.isfile(os.path.join(dir0, fn))
        if predicate(fn)
    )
    from_subdirs = (
        sp
        for sd in os.listdir(dir0)
        if os.path.isdir(os.path.join(dir0, sd))
        for sp in recursive_find_files(
            os.path.join(dir0, sd),
            predicate
        )
    )
    return (
        p
        for src in (here_files, from_subdirs)
        for p in src
    )


if __name__ == '__main__':
    start_dir = './docs'
    md_filepairs = list(recursive_find_files(start_dir, lambda fn: fn[-3:].lower() == '.md'))
    #
    print(f'Found {len(md_filepairs)} markdown files')
    content_map = {
        pair: load_lines(os.path.join(*pair))
        for pair in md_filepairs
    }
    #
    wh_filepairs = [
        pair
        for pair in md_filepairs
        if wh_eligible(content_map[pair])
    ]
    print(f'Found {len(wh_filepairs)} WH-eligible markdown files')
    #
    warning_map = {
        _p: _w
        for _p, _w in {
            pair: get_warnings(content_map[pair])
            for pair in wh_filepairs
        }.items()
        if _w
    }
    #
    print('\n===============\nWarnings found:')
    for wp, ws in sorted(warning_map.items()):
        print(os.path.join(*wp))
        for wi, wts in sorted(ws.items()):
            for wt in wts:
                print(f'    {wi}: {wt}')
