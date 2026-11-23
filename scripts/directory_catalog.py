"""Release evidence and curated entries share a directory, not an invented task protocol."""
import csv
import re
import json
import unicodedata
from collections import defaultdict
from datetime import date
from pathlib import Path
from historical_evidence import norm

BASES={'released','announcement','paper','tag','available_by','public_record','month','released_month','methodology'}
def slug_for(s):
    s=unicodedata.normalize('NFKC',s).casefold().replace('τ','tau')
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')

def validate_date(s):
    if not re.fullmatch(r'\d{4}(?:-\d\d(?:-\d\d)?)?',s):raise ValueError('Invalid directory date: '+s)
    date.fromisoformat((s+'-01-01')[:10] if len(s)==4 else s+'-01' if len(s)==7 else s)

def assemble_directory(cat, profiles, reported, editions, domains, check_url, arena_records=()):
    if {r['slug'] for r in profiles}!=cat.keys():raise ValueError('A catalog entry lacks an editorial domain / modality profile')
    directory={k:dict(r) for k,r in cat.items()}
    for r in profiles:directory[r['slug']].update(r)
    for x in directory.values():
        x['display_name']=x['name'];x['origin']='curated';x['date_note']=x['notes']
        x['reported_family']=''
    strict={}; alias={} # maps report families to covered editorial entries
    seen=set()
    for e in editions:
        k=e['slug']
        if k in seen or bool(e.get('existing'))!=(k in cat):raise ValueError('Conflicting edition: '+k)
        seen.add(k)
        if k not in directory:
            directory[k]=dict(name=e['name'],slug=k,first_author_affil='',affil_source_url='',logo_source_url='')
        x=directory[k]
        for a in ['domain','task','description','input','output','assessment','date','primary_url','protocol_url','date_basis','date_note']:x[a]=e.get(a,'')
        x.update(display_name=e['name'],series=e['family'],date_source_url=e['date_url'],display_date=e.get('display_date') or e['date'],
                 modalities=e['input_modality'],origin='edition',edition_order=e.get('edition_order',0),aliases=e.get('aliases',[]),alternative_dates=e.get('alternative_dated_evidence',[]),reported_family='')
        evidence_families=e.get('report_families',[e['family']])
        if k=='tau2-bench':evidence_families=[*evidence_families,'τ²-bench']
        strict[k]=dict(families=evidence_families,labels=e.get('reported_labels',[]),pattern=e.get('report_pattern',''))
        for f in evidence_families:alias.setdefault(norm(f),[]).append(k)
    for arena in arena_records:
        k=arena['slug']
        if k in directory:raise ValueError('Duplicate Arena directory entry: '+k)
        directory[k]=dict(slug=k,name=arena['name'],display_name=arena['name'],series=arena['name'],domain=arena['domain'],
            modalities=arena['modalities'],task=arena['task'],date=arena['date'],date_basis=arena['date_basis'],
            primary_url=arena['primary_url'],date_source_url=arena['date_url'],protocol_url=arena['protocol_url'],
            description=arena['description'],input=arena['input'],output=arena['output'],assessment=arena['assessment'],
            origin='arena',date_note='',first_author_affil='',logo_source_url='',affil_source_url='')
    # Keep the actual edition of benchmark labels visible. ARC-specific public
    # adapter variants are still ARC-AGI-3, not ARC-AGI-1 or the 2025 preview.
    for slug,digit in [('arc-agi',1),('arc-agi-2',2),('arc-agi-3',3)]:
        if slug in strict:strict[slug]['pattern']=rf'^ARC[- ]AGI[- ]{digit}(?:$|[ (])'
    for k, spec in strict.items():
        x=directory[k];later=sorted(y['date'] for y in directory.values()
                                    if y['series']==x['series'] and y['date']>x['date'] and y['origin']=='edition')
        if later and norm(x['series']) in {norm(n) for n in spec['labels']}:
            spec['unversioned_before'] = later[0]
            spec['unversioned_label'] = norm(x['series'])
    by_name={norm(x['name']):k for k,x in directory.items()}
    by_display={norm(x['display_name']):k for k,x in directory.items()}
    if len({norm(r['reported_family']) for r in reported})!=len(reported):raise ValueError('Duplicate directory evidence profile')
    coverage={}
    for r in reported:
        f=r['reported_family'];ident=norm(f)
        # Some related editions (CWE-bench v2 vs v1) have different identities;
        # only a reviewed family or normalized exact name absorbs the reference.
        found=list(dict.fromkeys(([by_name[ident]] if ident in by_name else [])+([by_display[ident]] if ident in by_display else [])+alias.get(ident,[])))
        if not found:
            k='ref-'+slug_for(f)
            if not k[4:] or k in directory:raise ValueError('Unresolved report identifier: '+f)
            project=r['protocol_url'] or r['date_url']
            directory[k]=dict(slug=k,name=f,display_name=f,series=r.get('series') or f,domain=r['domain'],modalities=r['modalities'],task=r['task'],
                date=r['date'],date_basis=r['date_basis'],date_source_url=r['date_url'],primary_url=project,protocol_url=r['protocol_url'],
                description=r['publication_title'],date_note='',origin='report',reported_family=f,first_author_affil='',affil_source_url='',logo_source_url='')
            found=[k]
        coverage[f]=found
    for base,edition,pattern in [('FrontierSWE','FrontierSWE v2',r'^FrontierSWE\s+v?2(?:$|[ (])'),
                                 ('OfficeQA','OfficeQA Pro',r'^OfficeQA[- ]Pro(?:$|[ (])'),
                                 ('SimpleQA','SimpleQA Verified',r'^SimpleQA[- ]Verified(?:$|[ (])')]:
        if base not in coverage or edition not in coverage:continue
        for k in coverage[base]:
            if k not in strict:strict[k]=dict(families=[base],labels=[],pattern='^(?!'+pattern[1:]+').+')
        for k in coverage[edition]:
            if k not in strict:strict[k]=dict(families=[base,edition],labels=[],pattern=pattern)
    for k,x in directory.items():
        if x['domain'] not in domains or not x['modalities'] or not x['series']:raise ValueError('Unclassified: '+k)
        for field in ('date_source_url','primary_url','protocol_url'):check_url(x[field])
        if not x['date_source_url'] or not x['primary_url']:raise ValueError('No dated source: '+k)
        validate_date(x['date']);validate_date(x.get('display_date') or x['date'])
        if x['date_basis'] not in BASES:raise ValueError('Unrecognized date event: '+str(x['date_basis']))
    return directory,strict,coverage
