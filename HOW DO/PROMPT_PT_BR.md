# Prompt em Portugues

Use este prompt no Codex ou ChatGPT quando quiser atualizar o mod **Mission Required Members Min1**.

```text
Tenho um mod antigo em JSON e um arquivo .pabgb original extraido da versao nova do jogo.

Quero atualizar o mod Mission Required Members Min1.

Use o JSON antigo para entender quais mudancas o mod fazia. Nao aplique os offsets antigos diretamente, porque eles podem ter mudado na nova versao do jogo.

Remapeie os offsets procurando os mesmos nodes e categorias de missao dentro do novo factionnode.pabgb.

Depois gere uma pasta com:
1. factionnode.pabgb atualizado
2. JSON novo com os offsets remapeados
3. relatorio simples dizendo quantas mudancas foram aplicadas e se houve algum erro

Arquivos:
- JSON antigo do mod: [colocar caminho aqui]
- arquivo original novo factionnode.pabgb: [colocar caminho aqui]

Observacao:
Eu extraio os arquivos originais do jogo usando PAZ Unlocker.
```

## Para os outros mods

Se for atualizar o **Mission Efficiency Bundle 20x**, use:

```text
Arquivo original novo: gamedata/skill.pabgb
```

Se for atualizar o **MEGA STACKS 999999**, use:

```text
Arquivo original novo: gamedata/iteminfo.pabgb
```

