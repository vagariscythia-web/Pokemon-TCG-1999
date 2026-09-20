Add-Type -AssemblyName System.Drawing
$root = 'c:\Users\KaanS\.gemini\antigravity\scratch\pokemon-tcg-1999_demo'
$dirs = @(
  (Join-Path $root 'raw'),
  (Join-Path $root 'public\assets\raw'),
  (Join-Path $root 'public\assets'),
  (Join-Path $root 'public'),
  (Join-Path $root 'src\assets\raw')
)
foreach ($d in $dirs) {
  if (Test-Path $d) {
    Get-ChildItem $d -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'Articuno|Zapdos' } | ForEach-Object {
      try {
        $i = [System.Drawing.Image]::FromFile($_.FullName)
        $p = $i.GetPixel(2, 2)
        $q = $i.GetPixel([int]($i.Width / 2), 2)
        $r = $i.GetPixel([int]($i.Width - 3), [int]($i.Height - 3))
        Write-Output ($_.FullName + ' | ' + $i.Width + 'x' + $i.Height + ' | ' + [math]::Round($_.Length / 1KB, 1) + 'KB | cornerTL=a' + $p.A + ',r' + $p.R + ',g' + $p.G + ',b' + $p.B + ' | topMid=a' + $q.A + ',r' + $q.R + ',g' + $q.G + ',b' + $q.B + ' | cornerBR=a' + $r.A + ',r' + $r.R + ',g' + $r.G + ',b' + $r.B)
        $i.Dispose()
      } catch {
        Write-Output ($_.FullName + ' | READ-ERROR')
      }
    }
  } else {
    Write-Output ('MISSING DIR: ' + $d)
  }
}
