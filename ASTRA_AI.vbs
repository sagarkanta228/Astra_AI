Set FSO = CreateObject("Scripting.FileSystemObject")
ScriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & ScriptDir & "\ASTRA_AI.bat" & chr(34), 0
Set WshShell = Nothing
Set FSO = Nothing
