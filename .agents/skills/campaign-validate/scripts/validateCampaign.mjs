#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { validatePartyMember } from "../../party-member-update/scripts/validatePartyMember.mjs";
import { formatMarkdownPath } from "../../../tools/markdown-format.mjs";
import { validateBusinesses } from "../../../tools/validate-businesses.mjs";
const root=path.resolve(process.argv[2]??"");
if(!process.argv[2]||!fs.existsSync(root)){console.error("Usage: node validateCampaign.mjs campaigns/<Player>");process.exit(2)}
const errors=[],warnings=[],rel=f=>path.relative(root,f).replaceAll("\\","/");
const walk=(d,x)=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const f=path.join(d,e.name);return e.isDirectory()?walk(f,x):(!x||e.name.endsWith(x)?[f]:[])}):[];
const need=(p,d=false)=>{const f=path.join(root,p);if(!fs.existsSync(f)||(d&&!fs.statSync(f).isDirectory()))errors.push(p+": missing required "+(d?"directory":"file"))};
["campaign-info.md","homebrew.md","party.md","world.md","data/status.json","data/inventory.json","data/party-state.json"].forEach(x=>need(x));
const resume=path.join(root,"resume.md"),resumeBak=path.join(root,"resume.bak");
if(!fs.existsSync(resume)&&!fs.existsSync(resumeBak))errors.push("resume.md: missing handoff checkpoint and no active-chat resume.bak");
["data","data/businesses","party","party/retired","npcs","factions","items","world","quests","quests/active","quests/resolved","log","log/Daily","log/Events","log/Combat","log/Milestones"].forEach(x=>need(x,true));
const json=new Map();
for(const f of walk(root,".json"))try{json.set(rel(f),JSON.parse(fs.readFileSync(f,"utf8")))}catch(e){errors.push(rel(f)+": invalid JSON ("+e.message+")")}
const status=json.get("data/status.json"),inventory=json.get("data/inventory.json"),state=json.get("data/party-state.json");
if(status){
  for(const k of ["Player","Day","Level","Xp","XpLevelUp","Gold","Silver","Copper","Location"])if(!(k in status))errors.push("data/status.json: missing "+k);
  const weekdayNames=new Set(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]);
  if(!Object.hasOwn(status,"day_of_week"))warnings.push("data/status.json: day_of_week missing; session-resume will initialize Sunday");
  else if(!weekdayNames.has(status.day_of_week))errors.push("data/status.json: day_of_week must be Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, or Saturday");
  if(Object.hasOwn(status,"debts")){
    if(!Array.isArray(status.debts))errors.push("data/status.json: debts must be an array when present");
    else{
      const ids=new Set();
      status.debts.forEach((debt,index)=>{
        const at="data/status.json: debts["+index+"]";
        if(!debt||typeof debt!=="object"||Array.isArray(debt)){errors.push(at+": must be an object");return}
        for(const k of ["id","name","purpose","created_day","next_due_day","recurrence_days","payments_remaining","amount","condition","status"])if(!Object.hasOwn(debt,k))errors.push(at+": missing "+k);
        if(typeof debt.id!=="string"||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(debt.id))errors.push(at+": id must be lowercase hyphenated text");
        else if(ids.has(debt.id))errors.push(at+": duplicate id "+debt.id);else ids.add(debt.id);
        if(typeof debt.name!=="string"||!debt.name.trim())errors.push(at+": name must be nonempty text");
        if(typeof debt.purpose!=="string"||!debt.purpose.trim())errors.push(at+": purpose must be nonempty text");
        if(!Number.isInteger(debt.created_day)||debt.created_day<0)errors.push(at+": created_day must be a nonnegative integer");
        if(!Number.isInteger(debt.next_due_day)||debt.next_due_day<0)errors.push(at+": next_due_day must be a nonnegative integer");
        if(Number.isInteger(debt.created_day)&&Number.isInteger(debt.next_due_day)&&debt.next_due_day<debt.created_day)errors.push(at+": next_due_day precedes created_day");
        const recurring=Number.isInteger(debt.recurrence_days)&&debt.recurrence_days>0;
        if(debt.recurrence_days!==null&&!recurring)errors.push(at+": recurrence_days must be null or a positive integer");
        if(debt.recurrence_days===null&&debt.payments_remaining!==1)errors.push(at+": one-time debt must have payments_remaining 1");
        if(recurring&&debt.payments_remaining!==null&&(!Number.isInteger(debt.payments_remaining)||debt.payments_remaining<1))errors.push(at+": recurring payments_remaining must be null or a positive integer");
        if(!debt.amount||typeof debt.amount!=="object"||Array.isArray(debt.amount))errors.push(at+": amount must be an object");
        else{
          let total=0;
          for(const [k,multiplier] of [["gp",100],["sp",10],["cp",1]]){
            if(!Object.hasOwn(debt.amount,k)||!Number.isInteger(debt.amount[k])||debt.amount[k]<0)errors.push(at+": amount."+k+" must be a nonnegative integer");
            else total+=debt.amount[k]*multiplier;
          }
          if(total===0)errors.push(at+": amount must be positive");
        }
        if(debt.condition!==null&&(typeof debt.condition!=="string"||!debt.condition.trim()))errors.push(at+": condition must be null or nonempty text");
        if(debt.status!=="active")errors.push(at+": active ledger status must be active");
        if(Number.isInteger(status.Day)&&Number.isInteger(debt.next_due_day)&&debt.next_due_day<status.Day)warnings.push(at+": overdue since Day "+debt.next_due_day);
      });
    }
  }
}
if(inventory&&!Array.isArray(inventory))errors.push("data/inventory.json: root must be an array");
if(state&&(!state.Characters||Array.isArray(state.Characters)))errors.push("data/party-state.json: Characters object missing");
const markdownFiles=walk(root,".md"),formatted=[];
try{const result=formatMarkdownPath(root);for(const item of result.results)if(item.changed)formatted.push(rel(item.file))}catch(e){errors.push("Markdown formatting failed ("+e.message+")")}
for(const f of markdownFiles)for(const m of fs.readFileSync(f,"utf8").matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){const t=m[1];if(/^(https?:\/\/|#)/i.test(t))continue;const p=decodeURIComponent(t.split("#",1)[0]);if(p&&!fs.existsSync(path.resolve(path.dirname(f),p)))errors.push(rel(f)+": broken link "+t)}
let active=[];const pi=path.join(root,"party.md");
if(fs.existsSync(pi)){active=[...fs.readFileSync(pi,"utf8").matchAll(/\[[^\]]+\]\(party\/([^/)]+)\.md\)/g)].map(m=>decodeURIComponent(m[1]));for(const n of new Set(active))if(active.filter(x=>x===n).length>1)errors.push("party.md: duplicate "+n);active=[...new Set(active)]}
for(const n of active){const r=validatePartyMember(root,n);errors.push(...r.errors);warnings.push(...r.warnings);if(!fs.existsSync(path.join(root,"party",n+".md")))errors.push("party/"+n+".md: missing hub");if(state&&!Object.hasOwn(state.Characters,n))errors.push("data/party-state.json: missing "+n);const sf=path.join(root,"party",n,"Stats.md");if(status&&fs.existsSync(sf)){const b=fs.readFileSync(sf,"utf8"),lvl=Number(b.match(/^\*\*Level:\*\* (\d+)/m)?.[1]),hp=Number(b.match(/^\*\*Hit Point Maximum:\*\* (\d+)/m)?.[1]),cur=state?.Characters?.[n]?.CurrentHP;if(lvl!==status.Level)errors.push("party/"+n+"/Stats.md: Level mismatch");if(Number.isFinite(hp)&&typeof cur==="number"&&cur>hp)errors.push("data/party-state.json: "+n+" HP exceeds maximum")}}
if(state)for(const n of Object.keys(state.Characters))if(!active.includes(n))errors.push("data/party-state.json: unindexed character "+n);
const pd=path.join(root,"party");
const validateInactiveHub=(n,f)=>{
  const b=fs.readFileSync(f,"utf8"),statusName=b.match(/^\*\*Status:\*\*\s*(Dead|Retired)\s*$/mi)?.[1];
  if(!statusName){errors.push("party/"+n+".md: unindexed hub without Dead or Retired status");return}
  if(fs.existsSync(path.join(pd,n)))errors.push("party/"+n+": inactive member has active directory");
  if(!fs.existsSync(path.join(pd,"retired",n)))errors.push("party/retired/"+n+": missing archive for "+statusName.toLowerCase()+" member");
  if(!new RegExp("\\([^)]*retired/"+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"/[^)]+\\)","i").test(b))errors.push("party/"+n+".md: missing archived-file link");
  if(statusName==="Retired"&&!new RegExp("\\([^)]*npcs/"+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\.md(?:#[^)]*)?\\)","i").test(b))errors.push("party/"+n+".md: retired redirect missing NPC link");
};
if(fs.existsSync(pd))for(const e of fs.readdirSync(pd,{withFileTypes:true})){
  if(e.isDirectory()&&e.name!=="retired"&&!active.includes(e.name))errors.push("party/"+e.name+": unindexed directory");
  if(e.isFile()&&e.name.endsWith(".md")&&!active.includes(path.basename(e.name,".md")))validateInactiveHub(path.basename(e.name,".md"),path.join(pd,e.name));
}
const exact=(f,want)=>{const p=path.join(root,f);if(fs.existsSync(p)){const got=[...fs.readFileSync(p,"utf8").matchAll(/^## (.+)$/gm)].map(m=>m[1].trim());if(JSON.stringify(got)!==JSON.stringify(want))errors.push(f+": sections missing, unexpected, or out of order")}};
exact("campaign-info.md",["World-Building Direction","World-Building Boundaries"]);
exact("resume.md",["Immediate Situation","Operational Continuity","Awaiting the Player","Present Characters","State References","Active Work","Other Open Threads","Recent Chronology","Relevant Milestones","Relevant Canon"]);
const q=path.join(root,"quests");if(fs.existsSync(q))for(const e of fs.readdirSync(q,{withFileTypes:true}))if(e.isFile()&&e.name.endsWith(".md"))errors.push("quests/"+e.name+": misplaced quest");
for(const f of walk(path.join(q,"active"),".md")){
  const b=fs.readFileSync(f,"utf8");
  if(/^\*{0,2}Story XP\*{0,2}:/mi.test(b))errors.push(rel(f)+": active quest must not contain Story XP");
}
for(const f of walk(path.join(q,"resolved"),".md")){
  const b=fs.readFileSync(f,"utf8"),xp=[...b.matchAll(/^\*{0,2}Story XP\*{0,2}:\s*(.+)$/gmi)];
  if(xp.length!==1)errors.push(rel(f)+": expected exactly one Story XP field");
  else if(!/\b\d+\s*XP\b/i.test(xp[0][1]))errors.push(rel(f)+": Story XP field must contain a numeric XP amount");
}
if(fs.existsSync(path.join(root,["Magic","Items.md"].join(" "))))errors.push("legacy monolithic item ledger exists");
const dailyLogDir=path.join(root,"log/Daily"),dailyLogFiles=walk(dailyLogDir,".md");
if(fs.existsSync(dailyLogDir)&&!dailyLogFiles.length)errors.push("log/Daily: no records");
for(const f of dailyLogFiles){
  const name=path.basename(f),match=/^(\d+)(?:-(\d+))? - (.+)\.md$/.exec(name);
  if(!match){errors.push(rel(f)+": filename must use <day> - <Location>.md or <start>-<end> - <Location>.md");continue}
  if(match[2]&&Number.parseInt(match[2])-Number.parseInt(match[1])<2)errors.push(rel(f)+": range Daily must span at least two skipped days");
}
const businesses=validateBusinesses(root);errors.push(...businesses.errors);warnings.push(...businesses.warnings);
errors.forEach(x=>console.error("ERROR: "+x));warnings.forEach(x=>console.warn("WARNING: "+x));
formatted.forEach(x=>console.log("FORMATTED: "+x));
console.log("Campaign structure: "+errors.length+" error(s), "+warnings.length+" warning(s); "+active.length+" active member(s), "+businesses.count+" business(es) checked");
process.exit(errors.length?1:0);
