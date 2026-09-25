#!/usr/bin/env python3
"""Restore only this revision, and refuse to overwrite subsequent edits."""
import argparse, hashlib, json, tarfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
backup=root/'.snapshots/kyoto-before-refinement-20260912'
p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');p.add_argument('--apply',action='store_true');args=p.parse_args()
manifest=json.loads((backup/'refinement-manifest.json').read_text())
def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest() if file.is_file() else None
conflicts=[name for name,rec in manifest.items() if digest(root/name)!=rec['after']]
if conflicts:
    raise SystemExit('REFUSED: files changed since this revision; preserve them before rollback:\n'+'\n'.join(conflicts))
print(f'SAFE: {len(manifest)} revision paths match the recorded state.')
if args.apply:
    with tarfile.open(backup/'workspace.tar.gz','r:gz') as archive:
        members={m.name.removeprefix('./'):m for m in archive.getmembers() if m.isfile()}
        for name,rec in manifest.items():
            target=root/name
            if not target.resolve().is_relative_to(root):raise SystemExit('Unsafe path in manifest')
            if rec['before'] is None:
                if target.exists():target.unlink()
            else:
                data=archive.extractfile(members[name]).read()
                if hashlib.sha256(data).hexdigest()!=rec['before']:raise SystemExit('Baseline hash mismatch: '+name)
                target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
    for directory in sorted({(root/name).parent for name in manifest},key=lambda d:len(d.parts),reverse=True):
        while directory!=root and directory.exists() and not any(directory.iterdir()):
            directory.rmdir();directory=directory.parent
    (backup/'rollback-receipt.txt').write_text('Kyoto refinement restored to its baseline. Git state and earlier CC work were preserved.\n')
    print('RESTORED. Reload the original Kyoto page.')
