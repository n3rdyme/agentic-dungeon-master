# Stats.md template

Use this exact order. Angle brackets are placeholders.

    # <Character> Stats

    **Rules Basis:** <2024 core plus explicit legacy, UA, or homebrew labels>

    **Level:** <total>

    **Class:** <class/subclass; each class level if multiclass>

    **Background:** <background>

    **Species:** <species>

    **Age:** <age or Unestablished>

    **Origin:** <origin or Unestablished>

    **Alignment:** <alignment>

    **Proficiency Bonus:** <modifier>

    **Initiative:** <modifier and sources>

    **Speed:** <value and sources>

    **Hit Point Maximum:** <value and sources>

    **Armor Class:** <each loadout and calculation>

    **Passive Perception:** <value>

    **Saving Throws:** <all modifiers; identify proficiencies>

    ## Ability Scores
    | Ability | Effective Modifier | Base Score | Effective Score |
    |---|---:|---:|---|
    | STR | <modifier> | <inherent score> | <effective score> from <source, or None> |
    | DEX | <modifier> | <inherent score> | <effective score> from <source, or None> |
    | CON | <modifier> | <inherent score> | <effective score> from <source, or None> |
    | INT | <modifier> | <inherent score> | <effective score> from <source, or None> |
    | WIS | <modifier> | <inherent score> | <effective score> from <source, or None> |
    | CHA | <modifier> | <inherent score> | <effective score> from <source, or None> |

    ## Skill Proficiencies
    - **<Skill>:** <modifier, source, Expertise if applicable>

    ## Proficiencies
    (optional; only when the authoritative source establishes armor, weapon, or tool proficiencies)
    - **Armor:** <training or None>
    - **Weapons:** <proficiencies or None>
    - **Tools:** <proficiencies or None>

    ## Features
    ### Background Features
    (optional; only when separately established)
    ### Species Features
    ### Class Features
    ### Subclass Features
    (only after a subclass is gained)
    ### Feats
    ### Other Features
    (optional; item-granted or other permanent mechanics)

    ## Spellcasting
    (only for spells or Pact Magic)

    **Spell Slots:** <by level, or None>

    **Pact Magic:** <only if applicable>

    ### <Class or Source> Spells
    (one per casting class in class order, then feat, species, and item sources)

    **Spellcasting Ability:** <ability>

    **Spell Save DC:** <value/calculation>

    **Spell Attack Bonus:** <value/calculation>

    **Cantrips:** <list or None>

    **Prepared/Known Spells:**
    - 1st: <spell>, +<concentration spell>
    - 2nd: <spell>
    (one list item per populated spell level; omit "level" and "prepared" from labels)

    **Always Prepared:**
    - <source>, 1st: <spell>, +<concentration spell>
    (optional; omit the entire field when none)

    **Spellbook:** <only if applicable>

    **Custom Spells:** [<spell>](Custom Spells.md#<anchor>)

    (optional; omit the entire field when none)

    ## Combat
    ### <Melee, Ranged, Spell, or Reaction> — <Attack or Action>
    **Attack/Save:** <bonus or DC>

    **Damage/Effect:** <expression/effect>

    **Range/Reach:** <value>

    **Properties:** <properties, mastery, attacks, riders>

    ## Languages
    - <language and source>

The table's Effective Modifier is calculated from the character's currently effective score. Base Score preserves the inherent score without temporary or equipment-set effects. Effective Score is `None` when nothing replaces the base score; otherwise it records both the replacement score and its source.

Example:

    | STR | +4 | 16 | 19 from Belt of Giant Strength |

Removing the belt restores STR 16 and its +3 modifier without reconstruction.

All identity fields, Ability Scores, Skill Proficiencies, Features, Combat, and Languages are required. Proficiencies, Background Features, Subclass Features, Other Features, and Spellcasting are conditional and occupy only the shown position. Combat subsections repeat. Equipment, personality, knowledge, and transient values belong in their separate canonical owners.

Alignment is required immediately after Origin. When migrating a character whose Stats.md predates this field, use `Neutral` unless canon establishes a different alignment.

Within every populated spell list, prefix each spell that requires concentration with `+`. Do not mark spells that merely have a duration or can produce an ongoing effect without concentration. Apply the same notation to prepared, known, always-prepared, spellbook, and custom spell listings.

Stats.md records whether a weapon has the ammunition property but never records the quantity of arrows, bolts, shells, cartridges, or other ammunition carried. Store every carried ammunition quantity only in Equipment.md.
