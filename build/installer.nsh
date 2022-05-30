;安装时写入
!macro customInstall
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-read" "" "上传本地图片到博客园图床"
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-read" "Icon" "$INSTDIR\makalo-cnblog-tool.exe"
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-read\command" "" '"$INSTDIR\makalo-cnblog-tool.exe" "read" "%1"'
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-upload" "" "上传到博客园"
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-upload" "Icon" "$INSTDIR\makalo-cnblog-tool.exe"
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-upload\command" "" '"$INSTDIR\makalo-cnblog-tool.exe" "upload" "%1"'
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-conver-base64" "" "markdonw文件图片转Base64"
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-conver-base64" "Icon" "$INSTDIR\makalo-cnblog-tool.exe"
    WriteRegStr HKCR "*\shell\makalo-cnblog-tool-conver-base64\command" "" '"$INSTDIR\makalo-cnblog-tool.exe" "conver-base64" "%1"'
!macroend
;卸载时清除
!macro customUninstall
    DeleteRegKey HKCR "*\shell\makalo-cnblog-tool-read"
    DeleteRegKey HKCR "*\shell\makalo-cnblog-tool-upload"
    DeleteRegKey HKCR "*\shell\makalo-cnblog-tool-conver-base64"
!macroend

;修改默认安装路径
!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\makalo-cnblog-tool"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\makalo-cnblog-tool"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\makalo-cnblog-tool"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\makalo-cnblog-tool"
!macroend