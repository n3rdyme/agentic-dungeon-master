#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const hs=(s,n)=>[...s.matchAll(new RegExp("^#{"+n+"} (.+)$","gm"))].map(x=>x[1].trim());
function ordered(actual, required, label, errors, allowed=[]) {
  let at=-1;
  for (const h of required) {
    const all=actual.map((x,i)=>x===h?i:-1).filter(i=>i>=0);
    if (!all.length) errors.push(label+": missing section "+h);
    else if (all.length>1) errors.push(label+": duplicate section "+h);
    else if (all[0]<=at) errors.push(label+": section out of order "+h);
    else at=all[0];
  }
  for (const h of actual) if (!required.includes(h)&&!allowed.includes(h))
    errors.push(label+": unexpected section "+h);
}
export function validatePartyMember(root,name) {
  const dir=path.join(path.resolve(root),"party",name), errors=[], warnings=[];
  for (const f of ["Bio.md","Appearance.md","Personality.md","Knowledge.md","Stats.md","Equipment.md"])
    if (!fs.existsSync(path.join(dir,f))) errors.push("party/"+name+"/"+f+": missing");
  const sf=path.join(dir,"Stats.md");
  if (fs.existsSync(sf)) {
    const b=fs.readFileSync(sf,"utf8"), label="party/"+name+"/Stats.md";
    if (hs(b,1)[0]!==name+" Stats") errors.push(label+": invalid title");
    const fields=["Rules Basis","Level","Class","Background","Species","Age","Origin","Alignment","Proficiency Bonus","Initiative","Speed","Hit Point Maximum","Armor Class","Passive Perception","Saving Throws"];
    let at=-1;
    for (const f of fields) {
      const all=[...b.matchAll(new RegExp("^\\*\\*"+f+":\\*\\*","gm"))];
      if (!all.length) errors.push(label+": missing field "+f);
      else if (all.length>1) errors.push(label+": duplicate field "+f);
      else if (all[0].index<=at) errors.push(label+": field out of order "+f);
      else at=all[0].index;
    }
    if(!/^\\| Ability \\| Effective Modifier \\| Base Score \\| Effective Score \\|$/m.test(b))
      errors.push(label+": missing exact Ability Scores table header");
    let abilityAt=-1;
    for (const ability of ["STR","DEX","CON","INT","WIS","CHA"]) {
      const pattern=new RegExp("^\\| "+ability+" \\| [+-]\\d+ \\| \\d+ \\| (?:None|\\d+ from [^|]+) \\|$","m");
      const match=b.match(pattern);
      if(!match) errors.push(label+": invalid or missing Ability Scores row "+ability);
      else {
        const index=b.indexOf(match[0]);
        if(index<=abilityAt) errors.push(label+": Ability Scores row out of order "+ability);
        abilityAt=index;
      }
    }
    const sec=hs(b,2);
    ordered(sec,["Ability Scores","Skill Proficiencies","Features","Combat","Languages"],label,errors,["Proficiencies","Spellcasting"]);
    if(sec.includes("Proficiencies")&&sec.indexOf("Proficiencies")!==sec.indexOf("Skill Proficiencies")+1)
      errors.push(label+": Proficiencies must immediately follow Skill Proficiencies");
    if (sec.includes("Spellcasting")&&sec.indexOf("Spellcasting")!==sec.indexOf("Features")+1)
      errors.push(label+": Spellcasting must immediately follow Features");
    if (/\b\d+\s+(?:arrows?|bolts?|shells?|cartridges?|bullets?|rounds?)\s+(?:carried|remaining)\b/i.test(b))
      errors.push(label+": ammunition quantities belong only in Equipment.md");
    const sub=hs(b,3), required=["Species Features","Class Features","Feats"];
    let cursor=-1;
    for (const h of required) {
      const i=sub.indexOf(h);
      if (i<0) errors.push(label+": missing feature subsection "+h);
      else if(i<=cursor) errors.push(label+": feature subsection out of order "+h);
      else cursor=i;
    }
    if (/^## Equipment$/m.test(b)) errors.push(label+": Equipment belongs in Equipment.md");
  }
  const pf=path.join(dir,"Personality.md");
  if (fs.existsSync(pf)) {
    const b=fs.readFileSync(pf,"utf8"), label="party/"+name+"/Personality.md";
    if (hs(b,1)[0]!==name+" Personality") errors.push(label+": invalid title");
    const associations=[...b.matchAll(/^\*\*Party Association:\*\* (.+)$/gm)];
    if (!associations.length) errors.push(label+": missing field Party Association");
    else if (associations.length>1) errors.push(label+": duplicate field Party Association");
    else if (!associations[0][1].trim()) errors.push(label+": empty field Party Association");
    else {
      const titleEnd=b.indexOf("\n",b.indexOf("# "));
      const coreAt=b.indexOf("\n## Core Identity");
      if (associations[0].index<=titleEnd||associations[0].index>=coreAt)
        errors.push(label+": Party Association must appear after the title and before Core Identity");
    }
    ordered(hs(b,2),["Core Identity","Personality Traits","Speech & Manner","Ideals","Bonds & Relationships","Flaws & Blind Spots","Defining Moments"],label,errors);
    for(const h of ["Appearance","Physical Description","Equipment","Current Physical State","Knowledge","Skills & Abilities"])
      if(new RegExp("^#{2,6} "+h+"$","m").test(b)) errors.push(label+": "+h+" belongs elsewhere");
  }
  const cf=path.join(dir,"Custom Spells.md");
  if(fs.existsSync(cf)) {
    const b=fs.readFileSync(cf,"utf8"), label="party/"+name+"/Custom Spells.md", spells=hs(b,2);
    if(hs(b,1)[0]!==name+" Custom Spells") errors.push(label+": invalid title");
    if(!spells.length) errors.push(label+": no spell definitions");
    for(const spell of spells) {
      const start=b.indexOf("## "+spell), next=b.indexOf("\n## ",start+4), entry=b.slice(start,next<0?undefined:next);
      for(const f of ["Casting Time","Range","Components","Duration"])
        if(!new RegExp("^\\*\\*"+f+":\\*\\*","m").test(entry)) errors.push(label+": "+spell+" missing "+f);
    }
  }
  return {errors,warnings};
}
if(import.meta.url===pathToFileURL(process.argv[1]??"").href) {
  if(!process.argv[2]||!process.argv[3]) { console.error("Usage: node validatePartyMember.mjs campaigns/<Player> <name>"); process.exit(2); }
  const r=validatePartyMember(process.argv[2],process.argv[3]);
  r.errors.forEach(x=>console.error("ERROR: "+x)); r.warnings.forEach(x=>console.warn("WARNING: "+x));
  console.log("Party-member validation: "+r.errors.length+" error(s), "+r.warnings.length+" warning(s)");
  process.exit(r.errors.length?1:0);
}
